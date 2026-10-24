import { builder, currentUser, loggedIn } from "../builder.js";
import { UserRef } from "../player/player.model.js";
import * as auth from "./auth.service.js";
import { AuthPayload } from "./auth.model.js";

builder.mutationFields((t) => ({
  signUp: t.field({
    type: AuthPayload,
    args: {
      email: t.arg.string({ required: true }),
      playertag: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: (_root, args) => auth.signUp(args),
  }),
  logIn: t.field({
    type: AuthPayload,
    args: { email: t.arg.string({ required: true }), password: t.arg.string({ required: true }) },
    resolve: (_root, args) => auth.logIn(args),
  }),
  logOut: t.boolean({
    resolve: async (_root, _args, context) => {
      if (context.token) await auth.deleteSession(context.token);
      return true;
    },
  }),
  verifyEmail: t.field({
    type: AuthPayload,
    args: { token: t.arg.string({ required: true }) },
    resolve: async (_root, { token }) => {
      const user = await auth.verifyEmail(token);
      return { user, token: await auth.createSession(user.id) };
    },
  }),
  resendVerification: t.boolean({
    args: { email: t.arg.string({ required: true }) },
    resolve: async (_root, { email }) => {
      await auth.resendVerification(email);
      return true;
    },
  }),
  requestPasswordReset: t.boolean({
    args: { email: t.arg.string({ required: true }) },
    resolve: async (_root, { email }) => {
      await auth.requestPasswordReset(email);
      return true;
    },
  }),
  resetPassword: t.boolean({
    args: { token: t.arg.string({ required: true }), password: t.arg.string({ required: true }) },
    resolve: async (_root, { token, password }) => {
      await auth.resetPassword(token, password);
      return true;
    },
  }),
  changePassword: t.boolean({
    authScopes: loggedIn,
    args: { currentPassword: t.arg.string({ required: true }), newPassword: t.arg.string({ required: true }) },
    resolve: async (_root, args, context) => {
      await auth.changePassword(currentUser(context), args.currentPassword, args.newPassword, context.token);
      return true;
    },
  }),
  changeEmail: t.field({
    type: UserRef,
    authScopes: loggedIn,
    args: { email: t.arg.string({ required: true }), password: t.arg.string({ required: true }) },
    resolve: (_root, args, context) => auth.changeEmail(currentUser(context), args.email, args.password),
  }),
}));
