import { NotificationType } from "../../generated/prisma/client.js";
import { builder } from "../builder.js";

builder.enumType(NotificationType, { name: "NotificationType" });

export const NotificationRef = builder.prismaObject("Notification", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    type: t.expose("type", { type: NotificationType }),
    seen: t.exposeBoolean("seen"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    invite: t.relation("invite", { nullable: true }),
  }),
});
