import { prisma } from "../../db.js";
import { builder } from "../builder.js";
import { visibleTournaments } from "./tournament.model.js";

builder.queryFields((t) => ({
  tournaments: t.prismaField({
    type: ["Tournament"],
    resolve: (query, _root, _args, context) =>
      prisma.tournament.findMany({ ...query, where: visibleTournaments(context), orderBy: { startsAt: "desc" } }),
  }),

  tournament: t.prismaField({
    type: "Tournament",
    nullable: true,
    args: { id: t.arg.int({ required: true }) },
    resolve: (query, _root, { id }, context) =>
      prisma.tournament.findFirst({ ...query, where: { id, ...visibleTournaments(context) } }),
  }),
}));
