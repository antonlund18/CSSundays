import { prisma } from "../../db.js";
import { builder } from "../builder.js";
import { visibleTournaments } from "../tournament/tournament.model.js";

builder.queryFields((t) => ({
  match: t.prismaField({
    type: "Match",
    nullable: true,
    args: { id: t.arg.int({ required: true }) },
    resolve: (query, _root, { id }, context) =>
      prisma.match.findFirst({ ...query, where: { id, tournament: visibleTournaments(context) } }),
  }),
}));
