import { prisma } from "../../db.js";
import { builder } from "../builder.js";

builder.queryFields((t) => ({
  matchChat: t.prismaField({
    type: ["MatchChatMessage"],
    args: { matchId: t.arg.int({ required: true }) },
    resolve: (query, _root, { matchId }) =>
      prisma.matchChatMessage.findMany({ ...query, where: { matchId }, orderBy: { createdAt: "asc" }, take: 500 }),
  }),
}));
