import { ServerStatus } from "../../generated/prisma/client.js";
import { builder } from "../builder.js";
import { MatchRef } from "../match/match.model.js";
import type { ServerOverview, TestServerState } from "./match-server.service.js";

builder.enumType(ServerStatus, { name: "ServerStatus" });

builder.prismaObjectFields(MatchRef, (t) => ({
  /** Null when servers are not hosted automatically. */
  serverStatus: t.expose("serverStatus", { type: ServerStatus, nullable: true }),
  /** Live round score from the game server. */
  score1: t.exposeInt("score1", { nullable: true }),
  score2: t.exposeInt("score2", { nullable: true }),
}));

/** A pool server borrowed from /admin/match-test to check the DatHost setup. */
export const TestServerRef = builder.objectRef<TestServerState>("TestServer").implement({
  fields: (t) => ({
    gameServerId: t.exposeString("gameServerId"),
    dathostMatchId: t.exposeString("dathostMatchId"),
    address: t.exposeString("address", { nullable: true }),
    map: t.exposeString("map"),
    startedAt: t.expose("startedAt", { type: "DateTime" }),
    finished: t.exposeBoolean("finished"),
    cancelReason: t.exposeString("cancelReason", { nullable: true }),
    score1: t.exposeInt("score1", { nullable: true }),
    score2: t.exposeInt("score2", { nullable: true }),
  }),
});

/** One of this deployment's DatHost servers, for the admin overview. */
export const MatchServerRef = builder.objectRef<ServerOverview>("MatchServer").implement({
  fields: (t) => ({
    gameServerId: t.exposeString("gameServerId"),
    name: t.exposeString("name"),
    address: t.exposeString("address", { nullable: true }),
    on: t.exposeBoolean("on"),
    booting: t.exposeBoolean("booting"),
    playersOnline: t.exposeInt("playersOnline", { nullable: true }),
    isTestServer: t.exposeBoolean("isTestServer"),
    match: t.field({ type: MatchRef, nullable: true, resolve: (server) => server.match }),
  }),
});
