import { InviteStatus } from "../../generated/prisma/client.js";
import { builder } from "../builder.js";

builder.enumType(InviteStatus, { name: "InviteStatus" });

export const TeamInviteRef = builder.prismaObject("TeamInvite", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    status: t.expose("status", { type: InviteStatus }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    team: t.relation("team"),
    sender: t.relation("sender"),
    recipient: t.relation("recipient"),
  }),
});
