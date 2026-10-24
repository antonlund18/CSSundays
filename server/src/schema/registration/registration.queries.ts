import { prisma } from "../../db.js";
import { builder } from "../builder.js";
import { visibleTournaments } from "../tournament/tournament.model.js";

builder.queryFields((t) => ({
  /** The registration (team + roster) the current player belongs to in a tournament. */
  myRegistration: t.prismaField({
    type: "TournamentRegistration",
    nullable: true,
    args: { tournamentId: t.arg.int({ required: true }) },
    resolve: (query, _root, { tournamentId }, context) =>
      context.user
        ? prisma.tournamentRegistration.findFirst({
            ...query,
            where: { tournamentId, players: { some: { userId: context.user.id } } },
          })
        : null,
  }),

  /** The current player's registrations in tournaments that have not finished yet (the activity sidebar). */
  myActiveRegistrations: t.prismaField({
    type: ["TournamentRegistration"],
    resolve: (query, _root, _args, context) =>
      context.user
        ? prisma.tournamentRegistration.findMany({
            ...query,
            where: {
              players: { some: { userId: context.user.id } },
              tournament: { status: { not: "FINISHED" }, ...visibleTournaments(context) },
            },
            orderBy: { tournament: { startsAt: "asc" } },
          })
        : [],
  }),
}));
