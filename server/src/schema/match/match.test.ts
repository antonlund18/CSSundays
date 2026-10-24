import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../db.js";
import { createTournamentWithTeams, createUser, gql, ok, rejects } from "../../test/helpers.js";
import { handleTimeout, restoreTimers } from "./match.service.js";

const READY = `mutation ($id: Int!) { markReady(matchId: $id) }`;
const BAN = `mutation ($id: Int!, $map: String!) { banMap(matchId: $id, map: $map) }`;
const WINNER = `mutation ($id: Int!, $winner: Int!) { reportMatchWinner(matchId: $id, winner: $winner) }`;

const match = (tournamentId: number, position: number) =>
  prisma.match.findUniqueOrThrow({ where: { tournamentId_position: { tournamentId, position } } });

const expire = (matchId: number) =>
  prisma.match.update({ where: { id: matchId }, data: { phaseEndsAt: new Date(Date.now() - 1000) } });

describe("a four-team tournament from ready check to champion", () => {
  let admin: string;
  let outsider: string;
  let tournamentId: number;
  // Captains of the left semifinal (position 2): team 1 and team 2.
  let cap1: string;
  let cap2: string;
  let semi: number;
  let semi2: number;
  let final: number;

  beforeAll(async () => {
    admin = (await createUser("flowadmin", "ADMIN")).token;
    outsider = (await createUser("flowoutsider")).token;
    const { tournament, captains } = await createTournamentWithTeams(4);
    tournamentId = tournament.id;
    await ok(`mutation ($id: Int!) { generateBracket(tournamentId: $id) }`, { id: tournamentId }, admin);
    await ok(`mutation ($id: Int!) { startTournament(tournamentId: $id) }`, { id: tournamentId }, admin);

    const left = await match(tournamentId, 2);
    semi = left.id;
    semi2 = (await match(tournamentId, 3)).id;
    final = (await match(tournamentId, 1)).id;
    const byRegistration = new Map(captains.map((captain) => [captain.registrationId, captain.token]));
    cap1 = byRegistration.get(left.registration1Id!)!;
    cap2 = byRegistration.get(left.registration2Id!)!;
  });

  it("starts in the ready check and only captains can ready up", async () => {
    expect((await prisma.match.findUniqueOrThrow({ where: { id: semi } })).phase).toBe("READY_CHECK");
    await rejects("NOT_CAPTAIN", READY, { id: semi }, outsider);
    await ok(READY, { id: semi }, cap1);
    const after = await prisma.match.findUniqueOrThrow({ where: { id: semi } });
    expect([after.phase, after.team1Ready, after.team2Ready]).toEqual(["READY_CHECK", true, false]);
  });

  it("starts a timed veto with a random first team once both are ready", async () => {
    await ok(READY, { id: semi }, cap2);
    const after = await prisma.match.findUniqueOrThrow({ where: { id: semi } });
    expect(after.phase).toBe("PICK_AND_BAN");
    expect([1, 2]).toContain(after.firstBanTeam);
    expect(after.phaseEndsAt!.getTime()).toBeGreaterThan(Date.now());
  });

  it("enforces alternating turns and valid maps", async () => {
    // Make team 1 ban first so the order below is deterministic.
    await prisma.match.update({ where: { id: semi }, data: { firstBanTeam: 1 } });
    await rejects("NOT_YOUR_TURN", BAN, { id: semi, map: "mirage" }, cap2);
    await ok(BAN, { id: semi, map: "mirage" }, cap1);
    await rejects("NOT_YOUR_TURN", BAN, { id: semi, map: "ancient" }, cap1);
    await rejects("MAP_ALREADY_BANNED", BAN, { id: semi, map: "mirage" }, cap2);
    await rejects("INVALID_MAP", BAN, { id: semi, map: "dust2" }, cap2);
    await ok(BAN, { id: semi, map: "ancient" }, cap2);
    await ok(BAN, { id: semi, map: "anubis" }, cap1);
    await ok(BAN, { id: semi, map: "nuke" }, cap2);
    await ok(BAN, { id: semi, map: "overpass" }, cap1);
  });

  it("bans a random map for the team whose turn timed out, then plays the last map", async () => {
    await expire(semi);
    await handleTimeout(semi);
    const auto = await prisma.matchBan.findFirstOrThrow({ where: { matchId: semi, ordinal: 6 } });
    expect([auto.team, auto.bannedById]).toEqual([2, null]);

    const after = await prisma.match.findUniqueOrThrow({ where: { id: semi } });
    expect(after.phase).toBe("IN_PROGRESS");
    expect(["vertigo", "inferno"]).toContain(after.mapSlug);
    expect(after.phaseEndsAt).toBeNull();
  });

  it("moves an expired ready check on to the veto", async () => {
    await expire(semi2);
    await handleTimeout(semi2);
    expect((await prisma.match.findUniqueOrThrow({ where: { id: semi2 } })).phase).toBe("PICK_AND_BAN");
  });

  it("ignores timeouts that have not expired", async () => {
    await handleTimeout(semi2);
    expect(await prisma.matchBan.count({ where: { matchId: semi2 } })).toBe(0);
  });

  it("fires timers by itself, including ones restored after a restart", async () => {
    await prisma.match.update({ where: { id: semi2 }, data: { phaseEndsAt: new Date(Date.now() + 200) } });
    await restoreTimers();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(await prisma.matchBan.count({ where: { matchId: semi2 } })).toBe(1);
  });

  it("shows the server address only to the two teams and staff", async () => {
    await ok(`mutation ($id: Int!) { setMatchServer(matchId: $id, address: "10.0.0.1:27015") }`, { id: semi }, admin);
    const query = `query ($id: Int!) { match(id: $id) { serverAddress } }`;
    const seen = async (token?: string) => (await gql<{ match: { serverAddress: string | null } }>(query, { id: semi }, token)).data!.match.serverAddress;
    expect(await seen(cap1)).toBe("10.0.0.1:27015");
    expect(await seen(admin)).toBe("10.0.0.1:27015");
    expect(await seen(outsider)).toBeNull();
    expect(await seen()).toBeNull();
  });

  it("only lets participants and staff chat", async () => {
    const send = `mutation ($id: Int!, $message: String!) { sendChatMessage(matchId: $id, message: $message) { id } }`;
    await rejects("FORBIDDEN", send, { id: semi, message: "hej" }, outsider);
    await ok(send, { id: semi, message: "glhf" }, cap1);
    await rejects("INVALID_INPUT", send, { id: semi, message: "x".repeat(257) }, cap1);
  });

  it("lets only staff report results", async () => {
    await rejects("FORBIDDEN", WINNER, { id: semi, winner: 1 }, cap1);
    await rejects("INVALID_WINNER", WINNER, { id: semi, winner: 3 }, admin);
    await ok(WINNER, { id: semi, winner: 1 }, admin);
    const after = await prisma.match.findUniqueOrThrow({ where: { id: semi } });
    expect([after.phase, after.winner]).toEqual(["FINISHED", 1]);
  });

  it("advances the winner and updates team records", async () => {
    const done = await prisma.match.findUniqueOrThrow({
      where: { id: semi },
      include: { registration1: { include: { team: true } }, registration2: { include: { team: true } } },
    });
    expect((await prisma.match.findUniqueOrThrow({ where: { id: final } })).registration1Id).toBe(done.registration1Id);
    expect([done.registration1!.team.wins, done.registration1!.team.losses]).toEqual([1, 0]);
    expect([done.registration2!.team.wins, done.registration2!.team.losses]).toEqual([0, 1]);
  });

  it("starts the final once both semifinals are decided and finishes the tournament", async () => {
    await ok(WINNER, { id: semi2, winner: 2 }, admin);
    const finalMatch = await prisma.match.findUniqueOrThrow({ where: { id: final } });
    expect([finalMatch.phase, finalMatch.registration2Id !== null]).toEqual(["READY_CHECK", true]);

    await ok(WINNER, { id: final, winner: 1 }, admin);
    expect((await prisma.tournament.findUniqueOrThrow({ where: { id: tournamentId } })).status).toBe("FINISHED");
  });
});
