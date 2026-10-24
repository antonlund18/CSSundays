import { builder, currentUser, loggedIn } from "../builder.js";
import * as chat from "./chat.service.js";
import { ChatMessageRef } from "./chat.model.js";

builder.mutationFields((t) => ({
  sendChatMessage: t.field({
    type: ChatMessageRef,
    authScopes: loggedIn,
    args: { matchId: t.arg.int({ required: true }), message: t.arg.string({ required: true }) },
    resolve: (_root, { matchId, message }, context) => chat.sendChatMessage(currentUser(context), matchId, message),
  }),
}));
