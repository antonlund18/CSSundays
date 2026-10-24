import { prisma } from "../../db.js";
import { builder } from "../builder.js";
import { UserRef } from "../player/player.model.js";

export const RegistrationRef = builder.prismaObject("TournamentRegistration", {
  name: "Registration",
  fields: (t) => ({
    id: t.exposeInt("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    captainId: t.exposeID("captainId"),
    tournamentId: t.exposeInt("tournamentId"),
    tournament: t.relation("tournament"),
    team: t.relation("team"),
    players: t.field({
      type: [UserRef],
      select: { players: { select: { user: true }, orderBy: { createdAt: "asc" } } },
      resolve: (registration) => registration.players.map((player) => player.user),
    }),
    /** The team's next unfinished match, or null before the bracket exists and after elimination. */
    currentMatch: t.prismaField({
      type: "Match",
      nullable: true,
      resolve: (query, registration) =>
        prisma.match.findFirst({
          ...query,
          where: {
            OR: [{ registration1Id: registration.id }, { registration2Id: registration.id }],
            phase: { notIn: ["FINISHED", "CANCELLED"] },
          },
          // Lower heap positions are later rounds.
          orderBy: { position: "asc" },
        }),
    }),
  }),
});
