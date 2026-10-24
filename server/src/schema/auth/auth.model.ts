import type { User } from "../../generated/prisma/client.js";
import { builder } from "../builder.js";
import { UserRef } from "../player/player.model.js";

export const AuthPayload = builder.objectRef<{ token: string | null; user: User }>("AuthPayload").implement({
  fields: (t) => ({
    token: t.exposeString("token", {
      nullable: true,
      description: "Bearer token for the new session. Null when the e-mail must be confirmed first.",
    }),
    user: t.field({ type: UserRef, resolve: (payload) => payload.user }),
  }),
});
