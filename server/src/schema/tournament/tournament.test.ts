import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../db.js";
import { createTournamentWithTeams, createUser, ok, rejects } from "../../test/helpers.js";
import { planBracket } from "./tournament.service.js";

describe("planBracket", () => {
  it("lays out five teams like the original platform", () => {
    const plan = planBracket([1, 2, 3, 4, 5]);
    expect([...plan].map(([position, slot]) => [position, slot.phase, slot.registration1Id, slot.registration2Id])).toEqual([
      [1, "WAITING_FOR_TEAMS", null, null],
      [2, "WAITING_FOR_TEAMS", 5, null], // bye straight into round two
      [3, "WAITING_TO_START", 2, 1], // two byes meet in round two
      [4, "CANCELLED", null, null],
      [5, "WAITING_TO_START", 4, 3],
      [6, "CANCELLED", null, null],
      [7, "CANCELLED", null, null],
    ]);
  });

  it("plays the final directly with two teams", () => {
    expect([...planBracket([1, 2])]).toEqual([[1, { registration1Id: 1, registration2Id: 2, phase: "WAITING_TO_START" }]]);
  });

  it("places every team exactly once and leaves no match unfillable, for 2 to 64 teams", () => {
    for (let teams = 2; teams <= 64; teams++) {
      const ids = Array.from({ length: teams }, (_, index) => index + 1);
      const plan = planBracket(ids);
      const size = 2 ** Math.ceil(Math.log2(teams));
      expect(plan.size).toBe(size - 1);

      const placed = [...plan.values()].flatMap((slot) => [slot.registration1Id, slot.registration2Id]).filter((id) => id !== null);
      expect(placed.sort((a, b) => a! - b!)).toEqual(ids);

      for (const [position, slot] of plan) {
        if (slot.phase !== "WAITING_FOR_TEAMS") continue;
        const left = plan.get(position * 2);
        const right = plan.get(position * 2 + 1);
        if (slot.registration1Id === null) expect(left?.phase, `${teams} teams, position ${position}`).not.toBe("CANCELLED");
        if (slot.registration2Id === null) expect(right?.phase, `${teams} teams, position ${position}`).not.toBe("CANCELLED");
      }
    }
  });
});

const GENERATE = `mutation ($id: Int!) { generateBracket(tournamentId: $id) }`;
const START = `mutation ($id: Int!) { startTournament(tournamentId: $id) }`;

describe("generating and starting a bracket", () => {
  let admin: string;
  let player: string;

  beforeAll(async () => {
    admin = (await createUser("bracketadmin", "ADMIN")).token;
    player = (await createUser("bracketplayer")).token;
  });

  it("is staff only", async () => {
    const { tournament } = await createTournamentWithTeams(4);
    await rejects("FORBIDDEN", GENERATE, { id: tournament.id }, player);
    await rejects("NOT_AUTHENTICATED", GENERATE, { id: tournament.id });
  });

  it("creates the matches, closes registration and can be regenerated before the start", async () => {
    const { tournament } = await createTournamentWithTeams(5);
    await ok(GENERATE, { id: tournament.id }, admin);
    await ok(GENERATE, { id: tournament.id }, admin);
    expect(await prisma.match.count({ where: { tournamentId: tournament.id } })).toBe(7);
    expect((await prisma.tournament.findUniqueOrThrow({ where: { id: tournament.id } })).status).toBe("CLOSED_FOR_REGISTRATIONS");
  });

  it("starts every ready match with a timed ready check and then locks the bracket", async () => {
    const { tournament } = await createTournamentWithTeams(5);
    await rejects("NO_BRACKET", START, { id: tournament.id }, admin);
    await ok(GENERATE, { id: tournament.id }, admin);
    await ok(START, { id: tournament.id }, admin);

    const readyChecks = await prisma.match.findMany({ where: { tournamentId: tournament.id, phase: "READY_CHECK" } });
    expect(readyChecks).toHaveLength(2);
    expect(readyChecks.every((match) => match.phaseEndsAt! > new Date())).toBe(true);

    await rejects("TOURNAMENT_ALREADY_STARTED", GENERATE, { id: tournament.id }, admin);
  });

  it("needs at least two teams", async () => {
    const { tournament } = await createTournamentWithTeams(1);
    await rejects("NOT_ENOUGH_TEAMS", GENERATE, { id: tournament.id }, admin);
  });

  it("exposes the bracket on the tournament", async () => {
    const { tournament } = await createTournamentWithTeams(3);
    await ok(GENERATE, { id: tournament.id }, admin);
    const data = await ok<{ tournament: { matches: { position: number; phase: string }[] } }>(
      `query ($id: Int!) { tournament(id: $id) { matches { position phase } } }`,
      { id: tournament.id },
    );
    expect(data.tournament.matches.map((match) => match.phase)).toEqual(["WAITING_FOR_TEAMS", "CANCELLED", "WAITING_TO_START"]);
  });
});
