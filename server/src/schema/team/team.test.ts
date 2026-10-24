import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../db.js";
import { createTeam, createUser, linkTestSteam, ok, rejects } from "../../test/helpers.js";

describe("teams, invites and registration", () => {
  let alice: { token: string; user: { id: string } };
  let bob: { token: string; user: { id: string } };
  let carol: { token: string; user: { id: string } };
  let teamId: number;
  let tournamentId: number;

  beforeAll(async () => {
    alice = await createUser("alice");
    bob = await createUser("bob");
    carol = await createUser("carol");
    tournamentId = (
      await prisma.tournament.create({ data: { name: "Open cup", startsAt: new Date(), maxTeams: 2, published: true } })
    ).id;
  });

  it("creates teams with unique names", async () => {
    const create = `mutation ($name: String!) { createTeam(name: $name) { id } }`;
    teamId = (await ok<{ createTeam: { id: number } }>(create, { name: "Alice Five" }, alice.token)).createTeam.id;
    await rejects("TEAM_NAME_IN_USE", create, { name: "alice five" }, bob.token);
    await rejects("INVALID_TEAM_NAME", create, { name: "x" }, bob.token);
  });

  it("invites with a notification and accepts into the team", async () => {
    const invite = `mutation ($team: Int!, $to: ID!) { inviteToTeam(teamId: $team, recipientId: $to) { id } }`;
    const { inviteToTeam } = await ok<{ inviteToTeam: { id: number } }>(invite, { team: teamId, to: bob.user.id }, alice.token);
    await rejects("INVITE_ALREADY_PENDING", invite, { team: teamId, to: bob.user.id }, alice.token);
    await rejects("NOT_TEAM_MEMBER", invite, { team: teamId, to: carol.user.id }, carol.token);

    // Outsiders cannot see invites for other teams.
    const visible = `query ($id: ID!) { invitesFor(userId: $id) { id } }`;
    expect((await ok<{ invitesFor: unknown[] }>(visible, { id: bob.user.id }, carol.token)).invitesFor).toHaveLength(0);

    const notifications = await ok<{ notifications: { invite: { id: number } }[] }>(`{ notifications { invite { id } } }`, {}, bob.token);
    expect(notifications.notifications[0].invite.id).toBe(inviteToTeam.id);

    await ok(`mutation ($id: Int!) { respondToInvite(inviteId: $id, accept: true) { status } }`, { id: inviteToTeam.id }, bob.token);
    await rejects("INVITE_NOT_PENDING", `mutation ($id: Int!) { respondToInvite(inviteId: $id, accept: false) { status } }`, { id: inviteToTeam.id }, bob.token);
    expect(await prisma.teamMember.count({ where: { teamId } })).toBe(2);
  });

  it("registers a team, adds teammates and enforces the rules", async () => {
    const register = `mutation ($t: Int!, $team: Int!) { registerForTournament(tournamentId: $t, teamId: $team) { id } }`;
    await rejects("STEAM_REQUIRED", register, { t: tournamentId, team: teamId }, alice.token);
    for (const player of [alice, bob, carol]) await linkTestSteam(player.user.id);

    await rejects("NOT_TEAM_MEMBER", register, { t: tournamentId, team: teamId }, carol.token);
    await ok(register, { t: tournamentId, team: teamId }, alice.token);
    await rejects("ALREADY_REGISTERED", register, { t: tournamentId, team: teamId }, alice.token);
    await ok(register, { t: tournamentId, team: teamId }, bob.token);

    const registration = await prisma.tournamentRegistration.findFirstOrThrow({ where: { tournamentId }, include: { players: true } });
    expect([registration.captainId, registration.players.length]).toEqual([alice.user.id, 2]);

    // Fill the second slot, then a third team does not fit.
    const dave = await createUser("dave");
    await linkTestSteam(dave.user.id);
    await createTeam("Dave Team", [dave.user.id]);
    await ok(register, { t: tournamentId, team: (await prisma.team.findFirstOrThrow({ where: { name: "Dave Team" } })).id }, dave.token);
    const erin = await createUser("erin");
    await linkTestSteam(erin.user.id);
    const erinTeam = await createTeam("Erin Team", [erin.user.id]);
    await rejects("TOURNAMENT_FULL", register, { t: tournamentId, team: erinTeam.id }, erin.token);
  });

  it("lets the captain withdraw the team before the bracket exists", async () => {
    await ok(`mutation ($t: Int!) { leaveTournament(tournamentId: $t) }`, { t: tournamentId }, bob.token);
    expect(await prisma.registrationPlayer.count({ where: { tournamentId, userId: bob.user.id } })).toBe(0);
    await ok(`mutation ($t: Int!) { leaveTournament(tournamentId: $t) }`, { t: tournamentId }, alice.token);
    expect(await prisma.tournamentRegistration.count({ where: { tournamentId, teamId } })).toBe(0);
  });

  it("keeps team ownership rules", async () => {
    await rejects("OWNER_CANNOT_LEAVE", `mutation ($id: Int!) { leaveTeam(teamId: $id) }`, { id: teamId }, alice.token);
    await rejects("FORBIDDEN", `mutation ($id: Int!, $u: ID!) { removeTeamMember(teamId: $id, userId: $u) }`, { id: teamId, u: alice.user.id }, bob.token);
    await ok(`mutation ($id: Int!) { leaveTeam(teamId: $id) }`, { id: teamId }, bob.token);
  });
});
