import { randomInt } from "node:crypto";
import { prisma, type Tx } from "../../db.js";
import type { Match, User } from "../../generated/prisma/client.js";
import { fail } from "../../lib/errors.js";
import { withLock } from "../../lib/lock.js";
import { events } from "../../lib/pubsub.js";
import { isStaff } from "../auth/auth.service.js";

export const READY_CHECK_SECONDS = 60;
export const BAN_SECONDS = 30;

const secondsFromNow = (seconds: number) => new Date(Date.now() + seconds * 1000);

/** Which team bans next: team 1 when (first + bans made) is odd. */
export function banTurn(firstBanTeam: number, bansMade: number): 1 | 2 {
  return (firstBanTeam + bansMade) % 2 === 1 ? 1 : 2;
}

// --- Timers ----------------------------------------------------------------------
//
// Ready checks and ban turns have deadlines stored in matches.phase_ends_at. A
// timer per match fires at the deadline; on start-up every pending deadline is
// re-armed, so a restart only delays (never loses) a timeout. Nothing polls the
// database, which lets Neon scale to zero when the site is idle.

const timers = new Map<number, NodeJS.Timeout>();

function armTimer(match: Pick<Match, "id" | "phase" | "phaseEndsAt">) {
  clearTimeout(timers.get(match.id));
  timers.delete(match.id);
  if (!match.phaseEndsAt || (match.phase !== "READY_CHECK" && match.phase !== "PICK_AND_BAN")) return;
  // Node timers overflow after ~24.8 days; deadlines are never that far away.
  const delay = Math.max(0, Math.min(match.phaseEndsAt.getTime() - Date.now(), 2 ** 31 - 1));
  const timer = setTimeout(() => {
    timers.delete(match.id);
    handleTimeout(match.id).catch((error) => console.error(`Timeout for match ${match.id} failed`, error));
  }, delay + 50);
  timer.unref();
  timers.set(match.id, timer);
}

export async function restoreTimers() {
  const pending = await prisma.match.findMany({
    where: { phase: { in: ["READY_CHECK", "PICK_AND_BAN"] }, phaseEndsAt: { not: null } },
    select: { id: true, phase: true, phaseEndsAt: true },
  });
  pending.forEach(armTimer);
  return pending.length;
}

export function stopTimers() {
  for (const timer of timers.values()) clearTimeout(timer);
  timers.clear();
}

/** Call after a transaction commits: re-arms timers and notifies subscribers. */
async function afterChange(matchIds: Iterable<number>) {
  for (const id of new Set(matchIds)) {
    const match = await prisma.match.findUnique({ where: { id }, select: { id: true, phase: true, phaseEndsAt: true, tournamentId: true } });
    if (!match) continue;
    armTimer(match);
    events.matchChanged(match.id, match.tournamentId);
    events.activity(await matchPlayerIds(match.id));
  }
}

async function matchPlayerIds(matchId: number) {
  const players = await prisma.registrationPlayer.findMany({
    where: { registration: { OR: [{ matchesAsTeam1: { some: { id: matchId } } }, { matchesAsTeam2: { some: { id: matchId } } }] } },
    select: { userId: true },
  });
  return players.map((player) => player.userId);
}

/** Runs `work` in a transaction while holding the tournament's lock. */
async function mutate(matchId: number, work: (tx: Tx, match: Match) => Promise<number[] | void>) {
  const found = await prisma.match.findUnique({ where: { id: matchId }, select: { tournamentId: true } });
  if (!found) fail("NOT_FOUND");
  const changed = await withLock(`tournament:${found.tournamentId}`, () =>
    prisma.$transaction(async (tx) => {
      const match = await tx.match.findUniqueOrThrow({ where: { id: matchId } });
      return (await work(tx, match)) ?? [matchId];
    }),
  );
  await afterChange(changed);
}

// --- State transitions (inside a transaction) --------------------------------------

export async function beginReadyCheck(tx: Tx, matchId: number) {
  await tx.matchBan.deleteMany({ where: { matchId } });
  await tx.match.update({
    where: { id: matchId },
    data: {
      phase: "READY_CHECK",
      phaseStartedAt: new Date(),
      phaseEndsAt: secondsFromNow(READY_CHECK_SECONDS),
      team1Ready: false,
      team2Ready: false,
      firstBanTeam: null,
      mapSlug: null,
      winner: null,
    },
  });
}

async function beginInProgress(tx: Tx, matchId: number, mapSlug: string | null) {
  await tx.match.update({
    where: { id: matchId },
    data: { phase: "IN_PROGRESS", phaseStartedAt: new Date(), phaseEndsAt: null, mapSlug },
  });
}

async function beginPickAndBan(tx: Tx, matchId: number) {
  await tx.matchBan.deleteMany({ where: { matchId } });
  const pool = await tx.gameMap.findMany({ where: { active: true }, select: { slug: true } });
  if (pool.length <= 1) {
    await beginInProgress(tx, matchId, pool[0]?.slug ?? null);
    return;
  }
  await tx.match.update({
    where: { id: matchId },
    data: {
      phase: "PICK_AND_BAN",
      phaseStartedAt: new Date(),
      phaseEndsAt: secondsFromNow(BAN_SECONDS),
      firstBanTeam: randomInt(1, 3),
    },
  });
}

/** Records a ban for the team whose turn it is; the last remaining map is played. */
async function applyBan(tx: Tx, match: Match, mapSlug: string, userId: string | null) {
  const bansMade = await tx.matchBan.count({ where: { matchId: match.id } });
  await tx.matchBan.create({
    data: {
      matchId: match.id,
      ordinal: bansMade + 1,
      mapSlug,
      team: banTurn(match.firstBanTeam ?? 1, bansMade),
      bannedById: userId,
    },
  });

  const remaining = await remainingMaps(tx, match.id);
  if (remaining.length <= 1) {
    await beginInProgress(tx, match.id, remaining[0] ?? null);
  } else {
    await tx.match.update({ where: { id: match.id }, data: { phaseEndsAt: secondsFromNow(BAN_SECONDS) } });
  }
}

async function remainingMaps(tx: Tx, matchId: number): Promise<string[]> {
  const banned = await tx.matchBan.findMany({ where: { matchId }, select: { mapSlug: true } });
  const maps = await tx.gameMap.findMany({
    where: { active: true, slug: { notIn: banned.map((ban) => ban.mapSlug) } },
    orderBy: { sortOrder: "asc" },
    select: { slug: true },
  });
  return maps.map((map) => map.slug);
}

/** Finishes a match, updates team records and moves the winner up the bracket. Returns changed match ids. */
async function finishMatch(tx: Tx, match: Match, winner: 1 | 2): Promise<number[]> {
  const winnerRegistration = winner === 1 ? match.registration1Id : match.registration2Id;
  const loserRegistration = winner === 1 ? match.registration2Id : match.registration1Id;

  await tx.match.update({
    where: { id: match.id },
    data: { phase: "FINISHED", phaseStartedAt: new Date(), phaseEndsAt: null, winner },
  });

  const [winnerReg, loserReg] = await Promise.all([
    tx.tournamentRegistration.findUniqueOrThrow({ where: { id: winnerRegistration! } }),
    tx.tournamentRegistration.findUniqueOrThrow({ where: { id: loserRegistration! } }),
  ]);
  await tx.team.update({ where: { id: winnerReg.teamId }, data: { wins: { increment: 1 } } });
  await tx.team.update({ where: { id: loserReg.teamId }, data: { losses: { increment: 1 } } });

  if (match.position === 1) {
    await tx.tournament.update({ where: { id: match.tournamentId }, data: { status: "FINISHED" } });
    return [match.id];
  }

  // The left child (even position) feeds team 1 of the parent, the right child team 2.
  const parent = await tx.match.update({
    where: { tournamentId_position: { tournamentId: match.tournamentId, position: Math.floor(match.position / 2) } },
    data: match.position % 2 === 0 ? { registration1Id: winnerRegistration } : { registration2Id: winnerRegistration },
  });

  if (
    parent.registration1Id !== null &&
    parent.registration2Id !== null &&
    (parent.phase === "WAITING_FOR_TEAMS" || parent.phase === "WAITING_TO_START")
  ) {
    const tournament = await tx.tournament.findUniqueOrThrow({ where: { id: match.tournamentId } });
    if (tournament.status === "IN_PROGRESS") await beginReadyCheck(tx, parent.id);
    else await tx.match.update({ where: { id: parent.id }, data: { phase: "WAITING_TO_START", phaseStartedAt: new Date() } });
  }
  return [match.id, parent.id];
}

async function captainIds(tx: Tx, match: Match) {
  const [one, two] = await Promise.all([
    match.registration1Id ? tx.tournamentRegistration.findUnique({ where: { id: match.registration1Id } }) : null,
    match.registration2Id ? tx.tournamentRegistration.findUnique({ where: { id: match.registration2Id } }) : null,
  ]);
  return { captain1: one?.captainId ?? null, captain2: two?.captainId ?? null };
}

// --- Timeouts ------------------------------------------------------------------------

/** Resolves an expired ready check or ban turn. Safe to call at any time. */
export async function handleTimeout(matchId: number) {
  await mutate(matchId, async (tx, match) => {
    if (!match.phaseEndsAt || match.phaseEndsAt > new Date()) return;
    if (match.phase === "READY_CHECK") {
      // Like the original platform, an expired ready check moves on to the veto.
      await beginPickAndBan(tx, match.id);
    } else if (match.phase === "PICK_AND_BAN") {
      const remaining = await remainingMaps(tx, match.id);
      await applyBan(tx, match, remaining[randomInt(remaining.length)], null);
    }
  });
}

// --- Player actions ----------------------------------------------------------------

export async function markReady(user: User, matchId: number) {
  await mutate(matchId, async (tx, match) => {
    if (match.phase !== "READY_CHECK") fail("WRONG_PHASE");
    const { captain1, captain2 } = await captainIds(tx, match);
    if (user.id !== captain1 && user.id !== captain2) fail("NOT_CAPTAIN");
    const team1Ready = match.team1Ready || user.id === captain1;
    const team2Ready = match.team2Ready || user.id === captain2;

    await tx.match.update({ where: { id: match.id }, data: { team1Ready, team2Ready } });
    if (team1Ready && team2Ready) await beginPickAndBan(tx, match.id);
  });
}

export async function banMap(user: User, matchId: number, mapSlug: string) {
  await mutate(matchId, async (tx, match) => {
    if (match.phase !== "PICK_AND_BAN") fail("WRONG_PHASE");
    const bansMade = await tx.matchBan.count({ where: { matchId } });
    const { captain1, captain2 } = await captainIds(tx, match);
    const captain = banTurn(match.firstBanTeam ?? 1, bansMade) === 1 ? captain1 : captain2;
    if (captain !== user.id) fail("NOT_YOUR_TURN");
    if (!(await tx.gameMap.findFirst({ where: { slug: mapSlug, active: true } }))) fail("INVALID_MAP");
    if (await tx.matchBan.findFirst({ where: { matchId, mapSlug } })) fail("MAP_ALREADY_BANNED");
    await applyBan(tx, match, mapSlug, user.id);
  });
}

export async function isParticipant(userId: string, match: Pick<Match, "registration1Id" | "registration2Id">) {
  const ids = [match.registration1Id, match.registration2Id].filter((id): id is number => id !== null);
  if (ids.length === 0) return false;
  return !!(await prisma.registrationPlayer.findFirst({ where: { registrationId: { in: ids }, userId } }));
}

// --- Staff actions -------------------------------------------------------------------

export async function reportWinner(user: User, matchId: number, winner: number) {
  if (!isStaff(user)) fail("FORBIDDEN");
  if (winner !== 1 && winner !== 2) fail("INVALID_WINNER");
  await mutate(matchId, async (tx, match) => {
    if (match.registration1Id === null || match.registration2Id === null) fail("MATCH_NOT_READY");
    if (match.phase === "FINISHED" || match.phase === "CANCELLED") fail("WRONG_PHASE");
    const tournament = await tx.tournament.findUniqueOrThrow({ where: { id: match.tournamentId } });
    if (tournament.status !== "IN_PROGRESS") fail("TOURNAMENT_NOT_STARTED");
    return finishMatch(tx, match, winner);
  });
}

export async function restartMatch(user: User, matchId: number) {
  if (!isStaff(user)) fail("FORBIDDEN");
  await mutate(matchId, async (tx, match) => {
    if (!["READY_CHECK", "PICK_AND_BAN", "IN_PROGRESS"].includes(match.phase)) fail("WRONG_PHASE");
    await beginReadyCheck(tx, match.id);
  });
}

export async function setServerAddress(user: User, matchId: number, address: string | null) {
  if (!isStaff(user)) fail("FORBIDDEN");
  await mutate(matchId, async (tx, match) => {
    await tx.match.update({ where: { id: match.id }, data: { serverAddress: address?.trim() || null } });
  });
}

export { afterChange as afterMatchChange };
