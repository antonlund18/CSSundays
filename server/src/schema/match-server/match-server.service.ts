import { prisma } from "../../db.js";
import type { Match, Prisma, User } from "../../generated/prisma/client.js";
import { fail } from "../../lib/errors.js";
import { withLock } from "../../lib/lock.js";
import { isStaff } from "../auth/auth.service.js";
import { notifyMatchChanged, reportServerResult } from "../match/match.service.js";
import { dathost, datHostConfig, type DatHostGameServer, type DatHostMatch } from "./dathost.client.js";

// Every match gets its own DatHost server: it is created when the match goes
// IN_PROGRESS and deleted when the match leaves IN_PROGRESS (finished, restarted or
// settled by staff). Servers are named "<prefix>-match-<id>", which lets start-up
// clean-up delete servers this deployment lost track of. Everything here runs under
// one in-process lock (the API runs as a single instance, see lib/lock.ts).

const serialised = <T>(work: () => Promise<T>) => withLock("match-servers", work);

const log = (message: string, error?: unknown) => console.error(`[match-server] ${message}`, error ?? "");

const serverFields = {
  id: true,
  tournamentId: true,
  phase: true,
  serverStatus: true,
  gameServerId: true,
  dathostMatchId: true,
} satisfies Prisma.MatchSelect;

type ServerMatch = Pick<Match, keyof typeof serverFields>;

/** Starts or deletes servers for matches that changed. Runs in the background and never throws. */
export function syncMatchServers(matchIds: number[]) {
  if (!datHostConfig() || matchIds.length === 0) return;
  void serialised(async () => {
    for (const id of matchIds) await syncOne(id);
  }).catch((error) => log("sync failed", error));
}

/** Resolves once all pending server work has run (used by tests). */
export const matchServersSettled = () => serialised(async () => {});

async function syncOne(matchId: number) {
  const match = await prisma.match.findUnique({ where: { id: matchId }, select: serverFields });
  if (!match) return;
  const live = match.phase === "IN_PROGRESS";
  if (live && (match.serverStatus === null || match.serverStatus === "ENDED")) await provision(match);
  else if (!live && (match.serverStatus === "ACTIVE" || match.serverStatus === "STARTING")) await release(match);
}

async function update(match: ServerMatch, data: Prisma.MatchUpdateInput) {
  await prisma.match.update({ where: { id: match.id }, data });
  await notifyMatchChanged(match);
}

const serverName = (kind: string) => `${datHostConfig()!.serverPrefix}-${kind}`;

/** Whether this deployment created the server (other deployments may share the DatHost account). */
const isOurs = ({ name = "" }: DatHostGameServer) => name.startsWith(serverName("match-")) || name === serverName("test");

/** The map name the server loads: the map's configured server map, else de_<slug>. */
export const serverMapName = (map: { slug: string; serverMap: string | null }) =>
  map.serverMap ?? (/^[a-z]+_/.test(map.slug) ? map.slug : `de_${map.slug}`);

const connectAddress = (server: DatHostGameServer | null) => {
  const host = server?.ip ?? server?.raw_ip;
  const port = server?.ports?.game;
  return host && port ? `${host}:${port}` : null;
};

const scores = (remote: DatHostMatch) => ({
  score1: remote.team1?.stats?.score ?? null,
  score2: remote.team2?.stats?.score ?? null,
});

// --- Creating and deleting servers -----------------------------------------------------

type NewDatHostMatch = {
  name: string;
  team1: string;
  team2: string;
  players: { steamId: string | null; team: "team1" | "team2" }[];
  map: string;
  /** Called as soon as the server exists, so it can be cleaned up if a later step fails. */
  onServerCreated: (gameServerId: string) => Promise<void>;
};

/** Creates a fresh server and starts a DatHost match on it. Deletes the server again if that fails. */
async function startDatHostMatch({ name, team1, team2, players, map, onServerCreated }: NewDatHostMatch) {
  const config = datHostConfig()!;
  const server = await dathost.createGameServer({ name, location: config.location });
  try {
    await onServerCreated(server.id);
    const created = await dathost.createMatch({
      game_server_id: server.id,
      team1: { name: team1 },
      team2: { name: team2 },
      // Only players with a linked Steam account can be let onto the server.
      players: players.flatMap(({ steamId, team }) => (steamId ? [{ steam_id_64: steamId, team }] : [])),
      settings: { map },
      ...(config.webhook
        ? {
            webhooks: {
              match_end_url: config.webhook.url,
              round_end_url: config.webhook.url,
              authorization_header: `Bearer ${config.webhook.secret}`,
            },
          }
        : {}),
    });
    // The address is known once the server exists; read it again in case the match API moved it.
    const current = await dathost.getGameServer(server.id).catch(() => server);
    return { gameServerId: server.id, dathostMatchId: created.id, address: connectAddress(current) ?? connectAddress(server) };
  } catch (error) {
    await deleteServer(server.id);
    throw error;
  }
}

/** Stops and deletes a server. Never throws: a server we fail to delete is cleaned up on the next start. */
async function deleteServer(gameServerId: string) {
  // Stopping first avoids paying for a server that is shutting down.
  await dathost.stopGameServer(gameServerId).catch(() => undefined);
  await dathost.deleteGameServer(gameServerId).catch((error) => log(`could not delete server ${gameServerId}`, error));
}

async function cancelIfRunning(dathostMatchId: string) {
  try {
    const remote = await dathost.getMatch(dathostMatchId);
    if (!remote.finished) await dathost.cancelMatch(dathostMatchId);
  } catch (error) {
    log(`could not cancel DatHost match ${dathostMatchId}`, error);
  }
}

// --- Match servers -----------------------------------------------------------------------

async function provision(match: ServerMatch) {
  await update(match, { serverStatus: "STARTING", gameServerId: null, dathostMatchId: null });
  try {
    const details = await prisma.match.findUniqueOrThrow({
      where: { id: match.id },
      select: { map: true, registration1: { select: roster }, registration2: { select: roster } },
    });
    const { registration1: team1, registration2: team2, map } = details;
    if (!team1 || !team2 || !map) throw new Error(`match ${match.id} has no teams or map`);

    const started = await startDatHostMatch({
      name: serverName(`match-${match.id}`),
      team1: team1.team.name,
      team2: team2.team.name,
      players: [
        ...team1.players.map((player) => ({ steamId: player.user.steamId, team: "team1" as const })),
        ...team2.players.map((player) => ({ steamId: player.user.steamId, team: "team2" as const })),
      ],
      map: serverMapName(map),
      onServerCreated: (gameServerId) => prisma.match.update({ where: { id: match.id }, data: { gameServerId } }).then(() => {}),
    });
    await update(match, {
      serverStatus: "ACTIVE",
      gameServerId: started.gameServerId,
      dathostMatchId: started.dathostMatchId,
      // Keep an address staff entered by hand if DatHost did not give us one.
      serverAddress: started.address ?? undefined,
      score1: 0,
      score2: 0,
    });
  } catch (error) {
    log(`could not start a server for match ${match.id}`, error);
    await update(match, { serverStatus: "FAILED", gameServerId: null });
  }
}

const roster = { team: { select: { name: true } }, players: { select: { user: { select: { steamId: true } } } } } as const;

async function release(match: ServerMatch) {
  await update(match, { serverStatus: "ENDED", serverAddress: null });
  if (match.dathostMatchId) await cancelIfRunning(match.dathostMatchId);
  if (match.gameServerId) await deleteServer(match.gameServerId);
}

// --- Updates from DatHost ------------------------------------------------------------

/** Called for every DatHost webhook (or poll): reads the match from DatHost and applies scores and the result. */
export function handleDatHostUpdate(dathostMatchId: string) {
  return serialised(() => applyRemoteState(dathostMatchId));
}

async function applyRemoteState(dathostMatchId: string) {
  if (testServer?.dathostMatchId === dathostMatchId) {
    if ((await dathost.getMatch(dathostMatchId)).finished) await deleteTestServer();
    return;
  }

  const match = await prisma.match.findUnique({ where: { dathostMatchId }, select: serverFields });
  // Old or unknown DatHost matches (e.g. one we cancelled ourselves) are ignored.
  if (!match || match.serverStatus !== "ACTIVE") return;

  // The webhook body is only a hint; the state is always read from DatHost itself, so a
  // forged webhook cannot decide a match.
  const remote = await dathost.getMatch(dathostMatchId);
  const { score1, score2 } = scores(remote);
  if (!remote.finished) {
    await update(match, { score1, score2 });
    return;
  }

  const winner = score1 !== null && score2 !== null && score1 !== score2 ? (score1 > score2 ? 1 : 2) : null;
  if (remote.cancel_reason || winner === null) {
    // Leave the result to staff; the server is no longer needed.
    log(`DatHost match ${dathostMatchId} ended without a winner (${remote.cancel_reason ?? `score ${score1}-${score2}`})`);
    await update(match, { serverStatus: "FAILED", score1, score2, serverAddress: null });
    if (match.gameServerId) await deleteServer(match.gameServerId);
    return;
  }

  await prisma.match.update({ where: { id: match.id }, data: { score1, score2 } });
  // Finishing the match triggers syncMatchServers, which deletes the server once this lock is free.
  await reportServerResult(match.id, winner);
}

/** Without webhooks (local development), running matches are polled instead. Returns a stop function. */
export function startResultPolling(intervalMs = 15_000) {
  const timer = setInterval(() => {
    pollRunningMatches().catch((error) => log("polling failed", error));
  }, intervalMs);
  timer.unref();
  return () => clearInterval(timer);
}

async function pollRunningMatches() {
  const running = await prisma.match.findMany({ where: { serverStatus: "ACTIVE" }, select: { dathostMatchId: true } });
  const ids = [...running.map((match) => match.dathostMatchId), testServer?.dathostMatchId];
  for (const id of ids) {
    if (id) await handleDatHostUpdate(id).catch((error) => log(`could not refresh ${id}`, error));
  }
}

// --- Staff and start-up --------------------------------------------------------------

/** Starts a server again after a failure, or re-reads the state of a running one. */
export async function retryMatchServer(user: User, matchId: number) {
  if (!isStaff(user)) fail("FORBIDDEN");
  if (!datHostConfig()) fail("SERVERS_NOT_CONFIGURED");
  await serialised(async () => {
    const match = await prisma.match.findUnique({ where: { id: matchId }, select: serverFields });
    if (!match) fail("NOT_FOUND");
    if (match.phase !== "IN_PROGRESS") fail("WRONG_PHASE");
    if (match.serverStatus === "ACTIVE" && match.dathostMatchId) await applyRemoteState(match.dathostMatchId);
    else await provision(match);
  });
}

/**
 * Catches up after a restart: replays missed results by reading every running match from
 * DatHost, restarts servers whose creation was interrupted, and deletes this deployment's
 * servers that no match uses any more (including a forgotten admin test server).
 */
export async function reconcileMatchServers() {
  const config = datHostConfig();
  if (!config) return;

  const running = await prisma.match.findMany({ where: { serverStatus: "ACTIVE" }, select: { dathostMatchId: true } });
  for (const { dathostMatchId } of running) {
    if (dathostMatchId) await handleDatHostUpdate(dathostMatchId).catch((error) => log(`could not refresh ${dathostMatchId}`, error));
  }

  await serialised(async () => {
    const interrupted = await prisma.match.findMany({ where: { serverStatus: "STARTING" }, select: serverFields });
    for (const match of interrupted) {
      if (match.gameServerId) await deleteServer(match.gameServerId);
      await update(match, { serverStatus: null, gameServerId: null });
    }
    syncMatchServers(interrupted.map((match) => match.id));

    const inUse = await prisma.match.findMany({ where: { serverStatus: "ACTIVE" }, select: { gameServerId: true } });
    const keep = new Set(inUse.map((match) => match.gameServerId));
    for (const server of await dathost.listGameServers()) {
      if (isOurs(server) && !keep.has(server.id)) {
        log(`deleting orphaned server ${server.id} (${server.name})`);
        await deleteServer(server.id);
      }
    }
  });
}

// --- Admin server overview -------------------------------------------------------------

export type ServerOverview = {
  gameServerId: string;
  name: string;
  address: string | null;
  on: boolean;
  booting: boolean;
  playersOnline: number | null;
  isTestServer: boolean;
  /** The match using the server; null for the test server and for orphans. */
  match: Match | null;
};

/** This deployment's servers on DatHost, with the match each one belongs to. */
export async function listMatchServers(user: User): Promise<ServerOverview[]> {
  if (!isStaff(user)) fail("FORBIDDEN");
  if (!datHostConfig()) fail("SERVERS_NOT_CONFIGURED");
  const servers = (await dathost.listGameServers()).filter(isOurs);
  const matches = await prisma.match.findMany({ where: { gameServerId: { in: servers.map((server) => server.id) } } });
  return servers.map((server) => ({
    gameServerId: server.id,
    name: server.name ?? server.id,
    address: connectAddress(server),
    on: server.on ?? false,
    booting: server.booting ?? false,
    playersOnline: server.players_online ?? null,
    isTestServer: server.id === testServer?.gameServerId,
    match: matches.find((match) => match.gameServerId === server.id) ?? null,
  }));
}

/**
 * Cancels whatever runs on the server and deletes it. A match that was using it is
 * marked FAILED, so its result is left to staff (or they start a new server with retry).
 */
export async function stopMatchServer(user: User, gameServerId: string) {
  if (!isStaff(user)) fail("FORBIDDEN");
  if (!datHostConfig()) fail("SERVERS_NOT_CONFIGURED");
  await serialised(async () => {
    if (testServer?.gameServerId === gameServerId) {
      await cancelIfRunning(testServer.dathostMatchId);
      await deleteTestServer();
      return;
    }
    const match = await prisma.match.findFirst({ where: { gameServerId }, select: serverFields });
    if (match) {
      await update(match, { serverStatus: "FAILED", gameServerId: null, dathostMatchId: null, serverAddress: null });
      if (match.dathostMatchId) await cancelIfRunning(match.dathostMatchId);
      await deleteServer(gameServerId);
      return;
    }
    const server = await dathost.getGameServer(gameServerId).catch(() => null);
    if (!server || !isOurs(server)) fail("NOT_FOUND");
    await deleteServer(gameServerId);
  });
}

// --- Admin test server ----------------------------------------------------------------
//
// Staff can start a throwaway server from /admin/match-test to check the DatHost setup.
// It is kept in memory only; after a restart the start-up clean-up deletes it.

type TestServer = {
  gameServerId: string;
  dathostMatchId: string;
  address: string | null;
  map: string;
  startedAt: Date;
};

let testServer: TestServer | null = null;

export type TestServerState = TestServer & {
  finished: boolean;
  cancelReason: string | null;
  score1: number | null;
  score2: number | null;
};

/** The running test server with its live state from DatHost, or null. */
export async function getTestServer(user: User): Promise<TestServerState | null> {
  if (!isStaff(user)) fail("FORBIDDEN");
  const current = testServer;
  if (!current) return null;
  const remote = await dathost.getMatch(current.dathostMatchId).catch((error) => {
    log(`could not read test match ${current.dathostMatchId}`, error);
    return null;
  });
  return {
    ...current,
    finished: remote?.finished ?? false,
    cancelReason: remote?.cancel_reason ?? null,
    ...(remote ? scores(remote) : { score1: null, score2: null }),
  };
}

const STEAM_ID = /^\d{17}$/;

/** Creates a server and starts a DatHost match on it; the given players join team 1. */
export async function startTestServer(user: User, mapSlug: string, steamIds: string[]) {
  if (!isStaff(user)) fail("FORBIDDEN");
  if (!datHostConfig()) fail("SERVERS_NOT_CONFIGURED");
  const ids = [...new Set(steamIds.map((id) => id.trim()).filter(Boolean))];
  if (ids.length === 0 || ids.some((id) => !STEAM_ID.test(id))) fail("INVALID_INPUT");

  await serialised(async () => {
    if (testServer) fail("TEST_SERVER_RUNNING");
    const map = await prisma.gameMap.findUnique({ where: { slug: mapSlug } });
    if (!map) fail("INVALID_MAP");
    try {
      const started = await startDatHostMatch({
        name: serverName("test"),
        team1: "Test A",
        team2: "Test B",
        players: ids.map((steamId) => ({ steamId, team: "team1" })),
        map: serverMapName(map),
        onServerCreated: async () => {},
      });
      testServer = { ...started, map: serverMapName(map), startedAt: new Date() };
    } catch (error) {
      log("could not start the test server", error);
      fail("SERVER_START_FAILED");
    }
  });
  return getTestServer(user);
}

/** Cancels the test match and deletes its server. */
export async function stopTestServer(user: User) {
  if (!isStaff(user)) fail("FORBIDDEN");
  await serialised(async () => {
    if (!testServer) return;
    await cancelIfRunning(testServer.dathostMatchId);
    await deleteTestServer();
  });
}

async function deleteTestServer() {
  if (!testServer) return;
  const { gameServerId } = testServer;
  testServer = null;
  await deleteServer(gameServerId);
}
