import { pubsub } from "../../lib/pubsub.js";
import { builder } from "../builder.js";

// Subscriptions are "something changed" signals; clients refetch the affected queries.
builder.subscriptionFields((t) => ({
  matchChanged: t.boolean({
    args: { matchId: t.arg.int({ required: true }) },
    subscribe: (_root, { matchId }) => pubsub.subscribe("match:changed", matchId),
    resolve: (payload) => payload,
  }),
}));
