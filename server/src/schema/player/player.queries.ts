import { prisma } from "../../db.js";
import { isPlayertagAvailable } from "../auth/auth.service.js";
import { builder } from "../builder.js";

builder.queryFields((t) => ({
  me: t.prismaField({
    type: "User",
    nullable: true,
    resolve: (query, _root, _args, context) =>
      context.user ? prisma.user.findUnique({ ...query, where: { id: context.user.id } }) : null,
  }),

  player: t.prismaField({
    type: "User",
    nullable: true,
    args: { playertag: t.arg.string({ required: true }) },
    resolve: (query, _root, { playertag }) =>
      prisma.user.findUnique({ ...query, where: { playertagKey: playertag.toLowerCase() } }),
  }),

  players: t.prismaField({
    type: ["User"],
    authScopes: { admin: true },
    resolve: (query) => prisma.user.findMany({ ...query, orderBy: { playertagKey: "asc" }, take: 1000 }),
  }),

  playertagAvailable: t.boolean({
    args: { playertag: t.arg.string({ required: true }) },
    resolve: (_root, { playertag }) => isPlayertagAvailable(playertag),
  }),
}));
