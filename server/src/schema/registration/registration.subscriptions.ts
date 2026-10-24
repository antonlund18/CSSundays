import { pubsub } from "../../lib/pubsub.js";
import { builder, currentUser } from "../builder.js";

builder.subscriptionFields((t) => ({
  /** Fires when anything in the current player's activity sidebar (myActiveRegistrations) changes. */
  myActivityChanged: t.boolean({
    authScopes: { loggedIn: true },
    subscribe: (_root, _args, context) => pubsub.subscribe("user:activity", currentUser(context).id),
    resolve: (payload) => payload,
  }),
}));
