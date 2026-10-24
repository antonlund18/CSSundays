import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { prisma } from "../../db.js";
import { env } from "../../env.js";
import { createTournamentWithTeams, createUser, ok, rejects } from "../../test/helpers.js";
import { dathost, datHostConfig, type CreateMatchRequest, type DatHostGameServer, type DatHostMatch } from "./dathost.client.js";
import { matchServersSettled, reconcileMatchServers } from "./match-server.service.js";
import { handleDatHostWebhook } from "./match-server.webhook.js";

const READY = `mutation ($id: Int!) { markReady(matchId: $id) }`;
const RESTART = `mutation ($id: Int!) { restartMatch(matchId: $id) }`;
const RETRY = `mutation ($id: Int!) { retryMatchServer(matchId: $id) }`;
const AUTH = "Bearer test-secret";
const WEBHOOK_URL = "https://api.test/webhooks/dathost";

/** What DatHost's GET endpoints return, per id. */
const remoteMatches = new Map<string, DatHostMatch>();
const remoteServers = new Map<string, DatHostGameServer>();
const webhook = (id: string, authorization = AUTH) => handleDatHostWebhook(authorization, JSON.stringify({ id }));
const result = (id: string, score1: number, score2: number, finished = true): DatHostMatch => ({
  id,
  finished,
  team1: { stats: { score: score1 } },
  team2: { stats: { score: score2 } },
});

const createGameServer = vi.spyOn(dathost, "createGameServer");
const deleteGameServer = vi.spyOn(dathost, "deleteGameServer");
const listGameServers = vi.spyOn(dathost, "listGameServers");
const createMatch = vi.spyOn(dathost, "createMatch");
const cancelMatch = vi.spyOn(dathost, "cancelMatch");

const load = (id: number) => prisma.match.findUniqueOrThrow({ where: { id } });

describe("DatHost match servers", () => {
  let admin: string;
  let player: string;
  let semiA: number;
  let semiB: number;
  const captains = new Map<number, { token: string; userId: string }>();

  /** Readies both captains; with a one-map pool the match goes straight to IN_PROGRESS. */
  async function goLive(matchId: number) {
    const match = await load(matchId);
    await ok(READY, { id: matchId }, captains.get(match.registration1Id!)!.token);
    await ok(READY, { id: matchId }, captains.get(match.registration2Id!)!.token);
    await matchServersSettled();
  }

  beforeAll(async () => {
    Object.assign(env, {
      DATHOST_EMAIL: "dathost@test.local",
      DATHOST_PASSWORD: "password",
      DATHOST_LOCATION: "copenhagen",
      DATHOST_WEBHOOK_URL: WEBHOOK_URL,
      DATHOST_WEBHOOK_SECRET: "test-secret",
    });
    let servers = 0;
    createGameServer.mockImplementation(async ({ name }) => {
      const id = `gs-${++servers}`;
      const server = { id, name, ip: `${id}.dathost.net`, ports: { game: 27015 } };
      remoteServers.set(id, server);
      return server;
    });
    vi.spyOn(dathost, "getGameServer").mockImplementation(async (id) => remoteServers.get(id)!);
    vi.spyOn(dathost, "stopGameServer").mockResolvedValue(undefined);
    deleteGameServer.mockImplementation(async (id) => remoteServers.delete(id));
    listGameServers.mockImplementation(async () => [...remoteServers.values()]);
    let matches = 0;
    createMatch.mockImplementation(async () => {
      const id = `dh-${++matches}`;
      remoteMatches.set(id, { id, finished: false });
      return { id };
    });
    vi.spyOn(dathost, "getMatch").mockImplementation(async (id) => remoteMatches.get(id)!);
    cancelMatch.mockResolvedValue(undefined);

    // The map pool survives between test runs, so reset what these tests change.
    await prisma.gameMap.updateMany({ where: { slug: { not: "mirage" } }, data: { active: false } });
    await prisma.gameMap.update({ where: { slug: "mirage" }, data: { serverMap: "de_mirage" } });
    admin = (await createUser("serveradmin", "ADMIN")).token;
    player = (await createUser("serverplayer")).token;
    const { tournament, captains: list } = await createTournamentWithTeams(4);
    for (const captain of list) captains.set(captain.registrationId, captain);
    await ok(`mutation ($id: Int!) { generateBracket(tournamentId: $id) }`, { id: tournament.id }, admin);
    await ok(`mutation ($id: Int!) { startTournament(tournamentId: $id) }`, { id: tournament.id }, admin);
    const position = (n: number) =>
      prisma.match.findUniqueOrThrow({ where: { tournamentId_position: { tournamentId: tournament.id, position: n } } });
    semiA = (await position(2)).id;
    semiB = (await position(3)).id;

    const first = captains.get((await load(semiA)).registration1Id!)!;
    await prisma.user.update({ where: { id: first.userId }, data: { steamId: "76561197960287930" } });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("creates a fresh server and starts a DatHost match on it when a match goes live", async () => {
    await goLive(semiA);
    expect(createGameServer).toHaveBeenCalledWith({ name: `cssundays-test-match-${semiA}`, location: "copenhagen" });
    expect(createMatch.mock.calls[0][0] as CreateMatchRequest).toMatchObject({
      game_server_id: "gs-1",
      settings: { map: "de_mirage" },
      players: [{ steam_id_64: "76561197960287930", team: "team1" }],
      webhooks: { match_end_url: WEBHOOK_URL, round_end_url: WEBHOOK_URL, authorization_header: AUTH },
    });
    const match = await load(semiA);
    expect([match.serverStatus, match.gameServerId, match.serverAddress]).toEqual(["ACTIVE", "gs-1", "gs-1.dathost.net:27015"]);
  });

  it("gives every live match its own server", async () => {
    await goLive(semiB);
    const match = await load(semiB);
    expect([match.serverStatus, match.gameServerId, match.dathostMatchId]).toEqual(["ACTIVE", "gs-2", "dh-2"]);
  });

  it("only accepts webhooks with the shared secret", async () => {
    expect(await webhook("dh-1", "Bearer wrong")).toBe(401);
    expect(await handleDatHostWebhook(AUTH, "not json")).toBe(400);
  });

  it("shows the live score from round-end webhooks", async () => {
    remoteMatches.set("dh-1", result("dh-1", 5, 3, false));
    expect(await webhook("dh-1")).toBe(200);
    const match = await load(semiA);
    expect([match.score1, match.score2, match.phase]).toEqual([5, 3, "IN_PROGRESS"]);
  });

  it("records the result and deletes the server", async () => {
    remoteMatches.set("dh-1", result("dh-1", 13, 7));
    expect(await webhook("dh-1")).toBe(200);
    await matchServersSettled();

    const finished = await load(semiA);
    expect([finished.phase, finished.winner, finished.serverStatus, finished.serverAddress]).toEqual(["FINISHED", 1, "ENDED", null]);
    expect(deleteGameServer).toHaveBeenCalledWith("gs-1");
    expect(cancelMatch).not.toHaveBeenCalled();

    // A repeated webhook changes nothing.
    expect(await webhook("dh-1")).toBe(200);
    expect((await load(semiA)).winner).toBe(1);
  });

  it("cancels the DatHost match and deletes the server when staff restart the match", async () => {
    await ok(RESTART, { id: semiB }, admin);
    await matchServersSettled();
    expect(cancelMatch).toHaveBeenCalledWith("dh-2");
    expect(deleteGameServer).toHaveBeenCalledWith("gs-2");
    const match = await load(semiB);
    expect([match.phase, match.serverStatus, match.serverAddress]).toEqual(["READY_CHECK", "ENDED", null]);
  });

  it("deletes the new server when the match cannot be started, and lets staff retry", async () => {
    createMatch.mockRejectedValueOnce(new Error("DatHost is down"));
    await goLive(semiB);
    expect((await load(semiB)).serverStatus).toBe("FAILED");
    expect(deleteGameServer).toHaveBeenCalledWith("gs-3");

    await rejects("FORBIDDEN", RETRY, { id: semiB }, player);
    await ok(RETRY, { id: semiB }, admin);
    const match = await load(semiB);
    expect([match.serverStatus, match.gameServerId]).toEqual(["ACTIVE", "gs-4"]);
  });

  it("leaves the result to staff when DatHost cancels the match", async () => {
    const { dathostMatchId } = await load(semiB);
    remoteMatches.set(dathostMatchId!, { id: dathostMatchId!, finished: true, cancel_reason: "MISSING_PLAYERS" });
    expect(await webhook(dathostMatchId!)).toBe(200);
    await matchServersSettled();
    const match = await load(semiB);
    expect([match.phase, match.serverStatus]).toEqual(["IN_PROGRESS", "FAILED"]);
    expect(deleteGameServer).toHaveBeenCalledWith("gs-4");
  });

  it("on start-up, restarts interrupted servers and deletes only its own orphaned servers", async () => {
    remoteServers.set("orphan", { id: "orphan", name: "cssundays-test-match-999" });
    remoteServers.set("production", { id: "production", name: "cssundays-match-1" });
    remoteServers.set("unrelated", { id: "unrelated", name: "my practice server" });
    await prisma.match.update({ where: { id: semiB }, data: { serverStatus: "STARTING", gameServerId: "half-made" } });

    await reconcileMatchServers();
    await matchServersSettled();

    const deleted = deleteGameServer.mock.calls.map(([id]) => id);
    expect(deleted).toEqual(expect.arrayContaining(["half-made", "orphan"]));
    expect(deleted).not.toContain("production");
    expect(deleted).not.toContain("unrelated");
    expect((await load(semiB)).serverStatus).toBe("ACTIVE");
  });

  it("ignores webhooks in development, where results are polled instead", async () => {
    env.NODE_ENV = "development";
    try {
      expect(datHostConfig()?.webhook).toBeNull();
      expect(await webhook("dh-1")).toBe(404);
    } finally {
      env.NODE_ENV = "test";
    }
  });

  it("lets staff set the map name the server loads", async () => {
    const update = `mutation ($serverMap: String) { updateMap(slug: "mirage", serverMap: $serverMap) { serverMap } }`;
    await rejects("FORBIDDEN", update, { serverMap: "de_mirage_test" }, player);
    await rejects("INVALID_INPUT", update, { serverMap: "not a map!" }, admin);
    await ok(update, { serverMap: "de_mirage_test" }, admin);
  });

  it("lists only this deployment's servers with their match, and lets staff stop one", async () => {
    const LIST = `{ matchServers { gameServerId match { id } } }`;
    const STOP = `mutation ($id: String!) { stopMatchServer(gameServerId: $id) }`;
    const { gameServerId, dathostMatchId } = await load(semiB);
    await rejects("FORBIDDEN", LIST, {}, player);

    const { matchServers } = await ok<{ matchServers: { gameServerId: string; match: { id: number } | null }[] }>(LIST, {}, admin);
    expect(matchServers).toEqual([{ gameServerId, match: { id: semiB } }]);

    await rejects("FORBIDDEN", STOP, { id: gameServerId }, player);
    await rejects("NOT_FOUND", STOP, { id: "unrelated" }, admin);
    await ok(STOP, { id: gameServerId }, admin);
    expect(cancelMatch).toHaveBeenCalledWith(dathostMatchId);
    expect(deleteGameServer).toHaveBeenCalledWith(gameServerId);
    const match = await load(semiB);
    expect([match.phase, match.serverStatus, match.gameServerId, match.serverAddress]).toEqual(["IN_PROGRESS", "FAILED", null, null]);
  });

  describe("the admin test server", () => {
    const START = `mutation ($map: String!, $steamIds: [String!]!) {
      startTestServer(map: $map, steamIds: $steamIds) { gameServerId address map finished }
    }`;
    const STEAM = "76561197960287930";

    it("creates a server and starts a DatHost match for the given players", async () => {
      await rejects("FORBIDDEN", START, { map: "mirage", steamIds: [STEAM] }, player);
      await rejects("INVALID_INPUT", START, { map: "mirage", steamIds: ["123"] }, admin);

      const { startTestServer } = await ok<{ startTestServer: { gameServerId: string; address: string; map: string } }>(
        START,
        { map: "mirage", steamIds: [STEAM] },
        admin,
      );
      expect(createGameServer).toHaveBeenCalledWith({ name: "cssundays-test-test", location: "copenhagen" });
      expect(startTestServer).toMatchObject({ map: "de_mirage_test" });
      expect(startTestServer.address).toBe(`${startTestServer.gameServerId}.dathost.net:27015`);
      expect(createMatch.mock.calls[0][0]).toMatchObject({ players: [{ steam_id_64: STEAM, team: "team1" }] });
      await rejects("TEST_SERVER_RUNNING", START, { map: "mirage", steamIds: [STEAM] }, admin);
    });

    it("cancels the match and deletes the server when stopped", async () => {
      const { testServer } = await ok<{ testServer: { gameServerId: string } }>(`{ testServer { gameServerId } }`, {}, admin);
      await ok(`mutation { stopTestServer }`, {}, admin);
      expect(cancelMatch).toHaveBeenCalled();
      expect(deleteGameServer).toHaveBeenCalledWith(testServer.gameServerId);
      expect((await ok<{ testServer: null }>(`{ testServer { map } }`, {}, admin)).testServer).toBeNull();
    });
  });
});
