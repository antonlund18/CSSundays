import { prisma } from "../../db.js";
import type { User } from "../../generated/prisma/client.js";
import { fail } from "../../lib/errors.js";
import { MAX_PLAYERS_PER_REGISTRATION } from "../../lib/validation.js";
import { isStaff } from "../auth/auth.service.js";
import { inTournament, playerIds, tournamentChanged } from "../tournament/tournament.service.js";

/** The first team member to register becomes captain; teammates join the same registration. */
export async function registerForTournament(user: User, tournamentId: number, teamId: number) {
  return inTournament(tournamentId, async () => {
    const result = await prisma.$transaction(async (tx) => {
      const tournament = await tx.tournament.findUnique({ where: { id: tournamentId } });
      if (!tournament || !(tournament.published || isStaff(user))) fail("NOT_FOUND");
      if (tournament.status !== "OPEN_FOR_REGISTRATIONS") fail("REGISTRATION_CLOSED");
      if (!(await tx.teamMember.findUnique({ where: { teamId_userId: { teamId, userId: user.id } } }))) fail("NOT_TEAM_MEMBER");
      if (await tx.registrationPlayer.findUnique({ where: { tournamentId_userId: { tournamentId, userId: user.id } } })) {
        fail("ALREADY_REGISTERED");
      }

      let registration = await tx.tournamentRegistration.findUnique({
        where: { tournamentId_teamId: { tournamentId, teamId } },
        include: { _count: { select: { players: true } } },
      });
      if (!registration) {
        if ((await tx.tournamentRegistration.count({ where: { tournamentId } })) >= tournament.maxTeams) fail("TOURNAMENT_FULL");
        registration = await tx.tournamentRegistration.create({
          data: { tournamentId, teamId, captainId: user.id },
          include: { _count: { select: { players: true } } },
        });
      } else if (registration._count.players >= MAX_PLAYERS_PER_REGISTRATION) {
        fail("TEAM_FULL");
      }

      await tx.registrationPlayer.create({ data: { registrationId: registration.id, tournamentId, userId: user.id } });
      return registration;
    });
    await tournamentChanged(tournamentId);
    return result;
  });
}

/** A captain leaving withdraws the whole team; anyone else just leaves the roster. */
export async function leaveTournament(user: User, tournamentId: number) {
  const removed = await inTournament(tournamentId, async () => {
    const entry = await prisma.registrationPlayer.findUnique({
      where: { tournamentId_userId: { tournamentId, userId: user.id } },
      include: { registration: true },
    });
    if (!entry) fail("NOT_REGISTERED");
    if (await prisma.match.findFirst({ where: { tournamentId } })) fail("BRACKET_LOCKED");

    if (entry.registration.captainId === user.id) {
      const roster = await playerIds({ registrationId: entry.registrationId });
      await prisma.tournamentRegistration.delete({ where: { id: entry.registrationId } });
      return roster;
    }
    await prisma.registrationPlayer.delete({
      where: { registrationId_userId: { registrationId: entry.registrationId, userId: user.id } },
    });
    return [user.id];
  });
  await tournamentChanged(tournamentId, removed);
}

export async function removeRegistration(user: User, registrationId: number) {
  const registration = await prisma.tournamentRegistration.findUnique({ where: { id: registrationId } });
  if (!registration) fail("NOT_FOUND");
  if (registration.captainId !== user.id && !isStaff(user)) fail("FORBIDDEN");
  const removed = await inTournament(registration.tournamentId, async () => {
    if (await prisma.match.findFirst({ where: { tournamentId: registration.tournamentId } })) fail("BRACKET_LOCKED");
    const roster = await playerIds({ registrationId });
    await prisma.tournamentRegistration.delete({ where: { id: registrationId } });
    return roster;
  });
  await tournamentChanged(registration.tournamentId, removed);
}
