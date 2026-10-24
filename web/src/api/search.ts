import { queryOptions } from "@tanstack/react-query";
import { graphql, request } from "@/lib/graphql";

export const searchTypes = ["all", "players", "teams", "tournaments"] as const;
export type SearchType = (typeof searchTypes)[number];

export const searchTypeLabels: Record<SearchType, string> = {
  all: "Alle",
  players: "Spillere",
  teams: "Hold",
  tournaments: "Turneringer",
};

export const MIN_SEARCH_LENGTH = 3;

const SearchQuery = graphql(`
  query Search($query: String!, $type: SearchType!) {
    search(query: $query, type: $type) {
      players { id playertag avatarUrl createdAt }
      teams { id name avatarUrl createdAt memberCount owner { playertag } }
      tournaments { id name pictureUrl startsAt registrationCount }
    }
  }
`);

export const searchQuery = (query: string, type: SearchType) =>
  queryOptions({
    queryKey: ["search", type, query],
    enabled: query.trim().length >= MIN_SEARCH_LENGTH,
    queryFn: async () =>
      (await request(SearchQuery, { query: query.trim(), type: type.toUpperCase() as "ALL" | "PLAYERS" | "TEAMS" | "TOURNAMENTS" }))
        .search,
  });
