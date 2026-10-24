import type { Team, Tournament, User } from "../../generated/prisma/client.js";
import { builder } from "../builder.js";
import { UserRef } from "../player/player.model.js";
import { TeamRef } from "../team/team.model.js";
import { TournamentRef } from "../tournament/tournament.model.js";

export const SearchType = builder.enumType("SearchType", { values: ["ALL", "PLAYERS", "TEAMS", "TOURNAMENTS"] as const });

type SearchResultShape = { players: User[]; teams: Team[]; tournaments: Tournament[] };

export const SearchResult = builder.objectRef<SearchResultShape>("SearchResult").implement({
  fields: (t) => ({
    players: t.field({ type: [UserRef], resolve: (result) => result.players }),
    teams: t.field({ type: [TeamRef], resolve: (result) => result.teams }),
    tournaments: t.field({ type: [TournamentRef], resolve: (result) => result.tournaments }),
  }),
});
