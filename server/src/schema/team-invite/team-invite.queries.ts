import { prisma } from "../../db.js";
import { builder, currentUser } from "../builder.js";

builder.queryFields((t) => ({
  /** Invites to a player: all of them for the player themself, otherwise only for teams you are on. */
  invitesFor: t.prismaField({
    type: ["TeamInvite"],
    authScopes: { loggedIn: true },
    args: { userId: t.arg.id({ required: true }) },
    resolve: (query, _root, { userId }, context) => {
      const viewer = currentUser(context);
      return prisma.teamInvite.findMany({
        ...query,
        where: {
          recipientId: String(userId),
          ...(viewer.id === String(userId) ? {} : { team: { members: { some: { userId: viewer.id } } } }),
        },
        orderBy: { createdAt: "desc" },
      });
    },
  }),
}));
