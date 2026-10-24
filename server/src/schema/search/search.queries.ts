import { prisma } from "../../db.js";
import { builder } from "../builder.js";
import { visibleTournaments } from "../tournament/tournament.model.js";
import { SearchResult, SearchType } from "./search.model.js";

const MIN_SEARCH_LENGTH = 3;
const SEARCH_LIMIT = 25;

builder.queryFields((t) => ({
  search: t.field({
    type: SearchResult,
    args: {
      query: t.arg.string({ required: true }),
      type: t.arg({ type: SearchType, defaultValue: "ALL" }),
    },
    resolve: async (_root, args, context) => {
      const text = args.query.trim();
      if (text.length < MIN_SEARCH_LENGTH) return { players: [], teams: [], tournaments: [] };
      const contains = { contains: text, mode: "insensitive" } as const;
      const want = (kind: string) => args.type === "ALL" || args.type === kind;
      const [players, teams, tournaments] = await Promise.all([
        want("PLAYERS")
          ? prisma.user.findMany({ where: { playertag: contains }, orderBy: { playertagKey: "asc" }, take: SEARCH_LIMIT })
          : [],
        want("TEAMS") ? prisma.team.findMany({ where: { name: contains }, orderBy: { nameKey: "asc" }, take: SEARCH_LIMIT }) : [],
        want("TOURNAMENTS")
          ? prisma.tournament.findMany({
              where: { name: contains, ...visibleTournaments(context) },
              orderBy: { startsAt: "desc" },
              take: SEARCH_LIMIT,
            })
          : [],
      ]);
      return { players, teams, tournaments };
    },
  }),
}));
