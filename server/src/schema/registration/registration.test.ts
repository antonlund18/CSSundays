import { beforeAll, describe, expect, it } from "vitest";
import { pubsub } from "../../lib/pubsub.js";
import { createTournamentWithTeams, createUser, ok } from "../../test/helpers.js";

const ACTIVE = `{ myActiveRegistrations { id tournament { id status } currentMatch { id phase } } }`;

type Active = { myActiveRegistrations: { id: number; tournament: { id: number; status: string }; currentMatch: { id: number; phase: string } | null }[] };

/** Resolves true if `userId` gets an activity signal while `action` runs. */
async function signals(userId: string, action: () => Promise<unknown>) {
  const iterator = pubsub.subscribe("user:activity", userId)[Symbol.asyncIterator]();
  const next = iterator.next().then(() => true);
  await action();
  const received = await Promise.race([next, new Promise<false>((resolve) => setTimeout(() => resolve(false), 200))]);
  await iterator.return?.();
  return received;
}

describe("the activity sidebar", () => {
  let admin: string;
  let tournamentId: number;
  let captain: { userId: string; token: string; registrationId: number };

  beforeAll(async () => {
    admin = (await createUser("activityadmin", "ADMIN")).token;
    const { tournament, captains } = await createTournamentWithTeams(2);
    tournamentId = tournament.id;
    captain = captains[0];
  });

  it("lists registrations without a match before the bracket exists", async () => {
    const data = await ok<Active>(ACTIVE, {}, captain.token);
    const entry = data.myActiveRegistrations.find((registration) => registration.tournament.id === tournamentId);
    expect(entry).toMatchObject({ id: captain.registrationId, currentMatch: null });
  });

  it("signals the players and shows the ready check when the tournament starts", async () => {
    await ok(`mutation ($id: Int!) { generateBracket(tournamentId: $id) }`, { id: tournamentId }, admin);
    const started = await signals(captain.userId, () =>
      ok(`mutation ($id: Int!) { startTournament(tournamentId: $id) }`, { id: tournamentId }, admin),
    );
    expect(started).toBe(true);

    const data = await ok<Active>(ACTIVE, {}, captain.token);
    const entry = data.myActiveRegistrations.find((registration) => registration.tournament.id === tournamentId);
    expect(entry?.currentMatch?.phase).toBe("READY_CHECK");
  });

  it("signals the match's players when they ready up", async () => {
    const data = await ok<Active>(ACTIVE, {}, captain.token);
    const matchId = data.myActiveRegistrations.find((registration) => registration.tournament.id === tournamentId)!.currentMatch!.id;
    expect(await signals(captain.userId, () => ok(`mutation ($id: Int!) { markReady(matchId: $id) }`, { id: matchId }, captain.token))).toBe(true);
  });

  it("drops the tournament once it is finished", async () => {
    const data = await ok<Active>(ACTIVE, {}, captain.token);
    const matchId = data.myActiveRegistrations.find((registration) => registration.tournament.id === tournamentId)!.currentMatch!.id;
    await ok(`mutation ($id: Int!) { reportMatchWinner(matchId: $id, winner: 1) }`, { id: matchId }, admin);
    const after = await ok<Active>(ACTIVE, {}, captain.token);
    expect(after.myActiveRegistrations.some((registration) => registration.tournament.id === tournamentId)).toBe(false);
  });

  it("is empty when logged out", async () => {
    expect(await ok<Active>(ACTIVE)).toEqual({ myActiveRegistrations: [] });
  });
});
