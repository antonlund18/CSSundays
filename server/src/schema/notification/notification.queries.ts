import { prisma } from "../../db.js";
import { builder, currentUser } from "../builder.js";

builder.queryFields((t) => ({
  notifications: t.prismaField({
    type: ["Notification"],
    authScopes: { loggedIn: true },
    resolve: (query, _root, _args, context) =>
      prisma.notification.findMany({
        ...query,
        where: { recipientId: currentUser(context).id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
  }),
}));
