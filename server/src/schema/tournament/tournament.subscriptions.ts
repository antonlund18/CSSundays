import { pubsub } from "../../lib/pubsub.js";
import { builder } from "../builder.js";

builder.subscriptionFields((t) => ({
  tournamentChanged: t.boolean({
    args: { tournamentId: t.arg.int({ required: true }) },
    subscribe: (_root, { tournamentId }) => pubsub.subscribe("tournament:changed", tournamentId),
    resolve: (payload) => payload,
  }),
}));
