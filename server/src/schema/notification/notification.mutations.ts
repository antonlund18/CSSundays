import { builder, currentUser, loggedIn } from "../builder.js";
import * as notifications from "./notification.service.js";

builder.mutationFields((t) => ({
  markNotificationsSeen: t.boolean({
    authScopes: loggedIn,
    resolve: async (_root, _args, context) => {
      await notifications.markNotificationsSeen(currentUser(context));
      return true;
    },
  }),
}));
