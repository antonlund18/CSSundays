import { prisma, type Tx } from "../../db.js";
import type { MatchPhase, Prisma, TournamentStatus, User } from "../../generated/prisma/client.js";
import { fail } from "../../lib/errors.js";
import { withLock } from "../../lib/lock.js";
import { events } from "../../lib/pubsub.js";
import { isStaff } from "../auth/auth.service.js";
import { afterMatchChange, beginReadyCheck } from "../match/match.service.js";

const requireStaff = (user: User) => {
  if (!isStaff(user)) fail("FORBIDDEN");
};

export const inTournament = <T>(tournamentId: number, work: () => Promise<T>) => withLock(`tournament:${tournamentId}`, work);

export const playerIds = async (where: Prisma.RegistrationPlayerWhereInput) =>
  (await prisma.registrationPlayer.findMany({ where, select: { userId: true } })).map((player) => player.userId);

/** Signals the tournament page and every registered player, plus `removed` players who are no longer on a roster. */
export async function tournamentChanged(tournamentId: number, removed: string[] = []) {
  events.tournamentChanged(tournamentId);
  events.activity([...(await playerIds({ tournamentId })), ...removed]);
}

// --- Staff: create / edit --------------------------------------------------------

export type TournamentInput = {
  name: string;
  description: string;
  rules: string;
  startsAt: Date;
  maxTeams: number;
  published: boolean;
  status?: TournamentStatus | null;
  picturePath?: string | null;
};

function validate(input: Partial<TournamentInput>) {
  if (input.name !== undefined && (input.name.trim().length < 2 || input.name.trim().length > 100)) fail("INVALID_INPUT");
  if (input.maxTeams !== undefined) {
    const size = input.maxTeams;
    if (size < 2 || size > 1024 || (size & (size - 1)) !== 0) fail("INVALID_INPUT");
  }
  if (input.startsAt !== undefined && Number.isNaN(input.startsAt.getTime())) fail("INVALID_INPUT");
}

export async function createTournament(user: User, input: TournamentInput) {
  requireStaff(user);
  validate(input);
  const { status: _status, ...data } = input;
  return prisma.tournament.create({ data: { ...data, name: input.name.trim(), createdById: user.id } });
}

export async function updateTournament(user: User, tournamentId: number, input: Partial<TournamentInput>) {
  requireStaff(user);
  validate(input);
  const data: Prisma.TournamentUpdateInput = { ...input, status: input.status ?? undefined };
  if (input.name !== undefined) data.name = input.name.trim();
  return inTournament(tournamentId, async () => {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { _count: { select: { registrations: true } } },
    });
    if (!tournament) fail("NOT_FOUND");
    if (input.maxTeams !== undefined && input.maxTeams < tournament._count.registrations) fail("INVALID_INPUT");
    const updated = await prisma.tournament.update({ where: { id: tournamentId }, data });
    await tournamentChanged(tournamentId);
    return updated;
  });
}

export async function deleteTournament(user: User, tournamentId: number) {
  requireStaff(user);
  const players = await playerIds({ tournamentId });
  await prisma.tournament.delete({ where: { id: tournamentId } });
  events.activity(players);
}

// --- Bracket -------------------------------------------------------------------------

type Slot = { registration1Id: number | null; registration2Id: number | null };

/**
 * Places registrations in a single-elimination tree (heap positions, final = 1).
 * Byes are handed out like the original platform: teams that skip the first
 * round are placed directly in round two, and empty first-round matches are
 * cancelled. Teams are taken from the end of the registration list.
 */
export function planBracket(registrationIds: number[]): Map<number, Slot & { phase: MatchPhase }> {
  const teamCount = registrationIds.length;
  let size = 2;
  while (size < teamCount) size *= 2;

  const slots = new Map<number, Slot>();
  for (let position = 1; position < size; position++) slots.set(position, { registration1Id: null, registration2Id: null });
  const remaining = [...registrationIds];
  const take = () => remaining.pop() ?? null;

  if (size === 2) {
    slots.set(1, { registration1Id: registrationIds[0] ?? null, registration2Id: registrationIds[1] ?? null });
  } else {
    let byes = size - teamCount;
    for (let parent = size / 4; parent < size / 2; parent++) {
      if (byes === 0) {
        // Both first-round matches below this parent are played.
        slots.set(parent * 2, { registration1Id: take(), registration2Id: take() });
        slots.set(parent * 2 + 1, { registration1Id: take(), registration2Id: take() });
      } else if (byes % 2 === 1) {
        // One team gets a bye; the right-hand first-round match is played.
        slots.set(parent, { registration1Id: take(), registration2Id: null });
        slots.set(parent * 2 + 1, { registration1Id: take(), registration2Id: take() });
        byes -= 1;
      } else {
        // Both teams get a bye and meet in round two.
        slots.set(parent, { registration1Id: take(), registration2Id: take() });
        byes -= 2;
      }
    }
  }

  const planned = new Map<number, Slot & { phase: MatchPhase }>();
  for (const [position, slot] of slots) {
    const teams = Number(slot.registration1Id !== null) + Number(slot.registration2Id !== null);
    const phase: MatchPhase =
      teams === 2 ? "WAITING_TO_START" : teams === 0 && position >= size / 2 ? "CANCELLED" : "WAITING_FOR_TEAMS";
    planned.set(position, { ...slot, phase });
  }
  return planned;
}

export async function generateBracket(user: User, tournamentId: number) {
  requireStaff(user);
  await inTournament(tournamentId, () =>
    prisma.$transaction(async (tx) => {
      const tournament = await tx.tournament.findUnique({ where: { id: tournamentId } });
      if (!tournament) fail("NOT_FOUND");
      if (tournament.status === "IN_PROGRESS" || tournament.status === "FINISHED") fail("TOURNAMENT_ALREADY_STARTED");

      const registrations = await tx.tournamentRegistration.findMany({
        where: { tournamentId },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true },
      });
      if (registrations.length < 2) fail("NOT_ENOUGH_TEAMS");

      const plan = planBracket(registrations.map((registration) => registration.id));
      await tx.match.deleteMany({ where: { tournamentId } });
      await tx.match.createMany({
        data: [...plan].map(([position, slot]) => ({ tournamentId, position, ...slot })),
      });
      await tx.tournament.update({ where: { id: tournamentId }, data: { status: "CLOSED_FOR_REGISTRATIONS" } });
    }),
  );
  await tournamentChanged(tournamentId);
}

export async function startTournament(user: User, tournamentId: number) {
  requireStaff(user);
  const started = await inTournament(tournamentId, () =>
    prisma.$transaction(async (tx: Tx) => {
      const tournament = await tx.tournament.findUnique({ where: { id: tournamentId } });
      if (!tournament) fail("NOT_FOUND");
      if (tournament.status === "IN_PROGRESS" || tournament.status === "FINISHED") fail("TOURNAMENT_ALREADY_STARTED");
      if (!(await tx.match.findFirst({ where: { tournamentId } }))) fail("NO_BRACKET");

      await tx.tournament.update({ where: { id: tournamentId }, data: { status: "IN_PROGRESS" } });
      const ready = await tx.match.findMany({ where: { tournamentId, phase: "WAITING_TO_START" }, select: { id: true } });
      for (const match of ready) await beginReadyCheck(tx, match.id);
      return ready.map((match) => match.id);
    }),
  );
  await afterMatchChange(started);
  await tournamentChanged(tournamentId);
}
