import { builder } from "../builder.js";

export const ChatMessageRef = builder.prismaObject("MatchChatMessage", {
  name: "ChatMessage",
  fields: (t) => ({
    id: t.exposeInt("id"),
    message: t.exposeString("message"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    sender: t.relation("sender"),
  }),
});
