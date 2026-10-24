import { MatchPhase } from "../../generated/prisma/client.js";
import { isStaff } from "../auth/auth.service.js";
import { builder } from "../builder.js";
import { isParticipant } from "./match.service.js";

builder.enumType(MatchPhase, { name: "MatchPhase" });

export const MatchRef = builder.prismaObject("Match", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    tournamentId: t.exposeInt("tournamentId"),
    position: t.exposeInt("position"),
    phase: t.expose("phase", { type: MatchPhase }),
    phaseStartedAt: t.expose("phaseStartedAt", { type: "DateTime" }),
    phaseEndsAt: t.expose("phaseEndsAt", { type: "DateTime", nullable: true }),
    team1Ready: t.exposeBoolean("team1Ready"),
    team2Ready: t.exposeBoolean("team2Ready"),
    firstBanTeam: t.exposeInt("firstBanTeam", { nullable: true }),
    mapSlug: t.exposeString("mapSlug", { nullable: true }),
    winner: t.exposeInt("winner", { nullable: true }),
    registration1Id: t.exposeInt("registration1Id", { nullable: true }),
    registration2Id: t.exposeInt("registration2Id", { nullable: true }),
    registration1: t.relation("registration1", { nullable: true }),
    registration2: t.relation("registration2", { nullable: true }),
    tournament: t.relation("tournament"),
    map: t.relation("map", { nullable: true }),
    bans: t.relation("bans", { query: { orderBy: { ordinal: "asc" } } }),
    /** The game server's connect address; only shown to the two teams and staff. */
    serverAddress: t.string({
      nullable: true,
      select: { serverAddress: true, registration1Id: true, registration2Id: true },
      resolve: async (match, _args, context) => {
        if (!match.serverAddress || !context.user) return null;
        if (isStaff(context.user) || (await isParticipant(context.user.id, match))) return match.serverAddress;
        return null;
      },
    }),
  }),
});

export const MatchBanRef = builder.prismaObject("MatchBan", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    ordinal: t.exposeInt("ordinal"),
    mapSlug: t.exposeString("mapSlug"),
    team: t.exposeInt("team"),
    /** True when the turn timed out and a random map was banned. */
    automatic: t.boolean({ select: { bannedById: true }, resolve: (ban) => ban.bannedById === null }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
  }),
});
