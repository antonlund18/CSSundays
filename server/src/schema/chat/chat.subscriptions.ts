import { pubsub } from "../../lib/pubsub.js";
import { builder } from "../builder.js";

builder.subscriptionFields((t) => ({
  chatMessageAdded: t.boolean({
    args: { matchId: t.arg.int({ required: true }) },
    subscribe: (_root, { matchId }) => pubsub.subscribe("chat:message", matchId),
    resolve: (payload) => payload,
  }),
}));
