import { pubsub } from "../../lib/pubsub.js";
import { builder, currentUser } from "../builder.js";

builder.subscriptionFields((t) => ({
  notificationsChanged: t.boolean({
    authScopes: { loggedIn: true },
    subscribe: (_root, _args, context) => pubsub.subscribe("user:notification", currentUser(context).id),
    resolve: (payload) => payload,
  }),
}));
