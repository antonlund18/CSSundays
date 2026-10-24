import { builder, currentUser, staff } from "../builder.js";
import { datHostConfig } from "./dathost.client.js";
import { MatchServerRef, TestServerRef } from "./match-server.model.js";
import * as matchServers from "./match-server.service.js";

builder.queryFields((t) => ({
  /** True when match servers are hosted automatically on DatHost. */
  matchServersEnabled: t.boolean({
    authScopes: staff,
    resolve: () => !!datHostConfig(),
  }),
  matchServers: t.field({
    description: "This deployment's servers on DatHost, with the match each one belongs to.",
    type: [MatchServerRef],
    authScopes: staff,
    resolve: (_root, _args, context) => matchServers.listMatchServers(currentUser(context)),
  }),
  testServer: t.field({
    type: TestServerRef,
    nullable: true,
    authScopes: staff,
    resolve: (_root, _args, context) => matchServers.getTestServer(currentUser(context)),
  }),
}));
