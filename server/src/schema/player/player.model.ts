import { UserRole } from "../../generated/prisma/client.js";
import { imageUrl } from "../../lib/storage.js";
import { builder } from "../builder.js";

export const UserRoleEnum = builder.enumType(UserRole, { name: "UserRole" });

export const UserRef = builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    playertag: t.exposeString("playertag"),
    description: t.exposeString("description"),
    avatarUrl: t.string({ nullable: true, select: { avatarPath: true }, resolve: (user) => imageUrl(user.avatarPath) }),
    steamId: t.exposeString("steamId", { nullable: true }),
    role: t.expose("role", { type: UserRole }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    /** Only visible to the user themself. */
    email: t.string({
      nullable: true,
      select: { email: true },
      resolve: (user, _args, context) => (context.user?.id === user.id ? user.email : null),
    }),
    emailVerified: t.boolean({
      nullable: true,
      select: { emailVerifiedAt: true },
      resolve: (user, _args, context) => (context.user?.id === user.id ? user.emailVerifiedAt !== null : null),
    }),
  }),
});
