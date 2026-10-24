import { UserRole } from "../../generated/prisma/client.js";
import { fail } from "../../lib/errors.js";
import { imageUrl } from "../../lib/storage.js";
import { builder, currentUser, loggedIn } from "../builder.js";
import * as players from "./player.service.js";
import * as steam from "./steam.service.js";
import { UserRef } from "./player.model.js";

const ImageTarget = builder.enumType("ImageTarget", { values: ["AVATAR", "TEAM", "TOURNAMENT"] as const });

builder.mutationFields((t) => ({
  updateProfile: t.field({
    type: UserRef,
    authScopes: loggedIn,
    args: { description: t.arg.string({ required: true }) },
    resolve: (_root, { description }, context) => players.updateProfile(currentUser(context), description),
  }),
  uploadImage: t.string({
    description: "Uploads a picture for your profile, a team you own or (staff) a tournament. Returns the new URL.",
    authScopes: loggedIn,
    nullable: true,
    args: {
      target: t.arg({ type: ImageTarget, required: true }),
      id: t.arg.int(),
      file: t.arg({ type: "File", required: true }),
    },
    resolve: async (_root, args, context) => {
      const user = currentUser(context);
      if (args.target !== "AVATAR" && !args.id) fail("INVALID_INPUT");
      const target = args.target === "AVATAR" ? ({ kind: "AVATAR" } as const) : { kind: args.target, id: args.id! };
      return imageUrl(await players.uploadPicture(user, target, args.file));
    },
  }),
  linkSteam: t.field({
    type: UserRef,
    authScopes: loggedIn,
    args: { params: t.arg({ type: "JSON", required: true }) },
    resolve: (_root, { params }, context) => {
      if (!params || typeof params !== "object") fail("STEAM_VERIFICATION_FAILED");
      return steam.linkSteam(currentUser(context), params as Record<string, unknown>);
    },
  }),
  unlinkSteam: t.field({
    type: UserRef,
    authScopes: loggedIn,
    resolve: (_root, _args, context) => steam.unlinkSteam(currentUser(context)),
  }),
  setUserRole: t.field({
    type: UserRef,
    authScopes: { admin: true },
    args: { userId: t.arg.id({ required: true }), role: t.arg({ type: UserRole, required: true }) },
    resolve: (_root, args, context) => players.setUserRole(currentUser(context), String(args.userId), args.role),
  }),
}));
