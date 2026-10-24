import { prisma } from "../../db.js";
import { builder } from "../builder.js";

builder.queryFields((t) => ({
  maps: t.prismaField({
    type: ["GameMap"],
    resolve: (query) => prisma.gameMap.findMany({ ...query, orderBy: { sortOrder: "asc" } }),
  }),
}));
