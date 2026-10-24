import { builder, currentUser, staff } from "../builder.js";
import { TestServerRef } from "./match-server.model.js";
import * as matchServers from "./match-server.service.js";

builder.mutationFields((t) => ({
  retryMatchServer: t.boolean({
    description: "Starts a server again after a failure, or re-reads the state of the running one.",
    authScopes: staff,
    args: { matchId: t.arg.int({ required: true }) },
    resolve: async (_root, { matchId }, context) => {
      await matchServers.retryMatchServer(currentUser(context), matchId);
      return true;
    },
  }),
  stopMatchServer: t.boolean({
    description: "Cancels what runs on the server and deletes it; a match using it is marked FAILED.",
    authScopes: staff,
    args: { gameServerId: t.arg.string({ required: true }) },
    resolve: async (_root, { gameServerId }, context) => {
      await matchServers.stopMatchServer(currentUser(context), gameServerId);
      return true;
    },
  }),
  startTestServer: t.field({
    description: "Starts a DatHost match on a free pool server; the given Steam ids may join.",
    type: TestServerRef,
    nullable: true,
    authScopes: staff,
    args: { map: t.arg.string({ required: true }), steamIds: t.arg.stringList({ required: true }) },
    resolve: (_root, { map, steamIds }, context) => matchServers.startTestServer(currentUser(context), map, steamIds),
  }),
  stopTestServer: t.boolean({
    authScopes: staff,
    resolve: async (_root, _args, context) => {
      await matchServers.stopTestServer(currentUser(context));
      return true;
    },
  }),
}));
