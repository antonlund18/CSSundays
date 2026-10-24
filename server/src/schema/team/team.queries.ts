import { prisma } from "../../db.js";
import { builder, currentUser } from "../builder.js";

builder.queryFields((t) => ({
  teams: t.prismaField({
    type: ["Team"],
    resolve: (query) => prisma.team.findMany({ ...query, orderBy: [{ wins: "desc" }, { nameKey: "asc" }] }),
  }),

  team: t.prismaField({
    type: "Team",
    nullable: true,
    args: { id: t.arg.int({ required: true }) },
    resolve: (query, _root, { id }) => prisma.team.findUnique({ ...query, where: { id } }),
  }),

  myTeams: t.prismaField({
    type: ["Team"],
    authScopes: { loggedIn: true },
    resolve: (query, _root, _args, context) =>
      prisma.team.findMany({
        ...query,
        where: { members: { some: { userId: currentUser(context).id } } },
        orderBy: { nameKey: "asc" },
      }),
  }),
}));
