import { builder, currentUser, loggedIn, staff } from "../builder.js";
import * as matches from "./match.service.js";

builder.mutationFields((t) => ({
  markReady: t.boolean({
    authScopes: loggedIn,
    args: { matchId: t.arg.int({ required: true }) },
    resolve: async (_root, { matchId }, context) => {
      await matches.markReady(currentUser(context), matchId);
      return true;
    },
  }),
  banMap: t.boolean({
    authScopes: loggedIn,
    args: { matchId: t.arg.int({ required: true }), map: t.arg.string({ required: true }) },
    resolve: async (_root, { matchId, map }, context) => {
      await matches.banMap(currentUser(context), matchId, map);
      return true;
    },
  }),
  reportMatchWinner: t.boolean({
    authScopes: staff,
    args: { matchId: t.arg.int({ required: true }), winner: t.arg.int({ required: true }) },
    resolve: async (_root, { matchId, winner }, context) => {
      await matches.reportWinner(currentUser(context), matchId, winner);
      return true;
    },
  }),
  restartMatch: t.boolean({
    authScopes: staff,
    args: { matchId: t.arg.int({ required: true }) },
    resolve: async (_root, { matchId }, context) => {
      await matches.restartMatch(currentUser(context), matchId);
      return true;
    },
  }),
  setMatchServer: t.boolean({
    authScopes: staff,
    args: { matchId: t.arg.int({ required: true }), address: t.arg.string() },
    resolve: async (_root, { matchId, address }, context) => {
      await matches.setServerAddress(currentUser(context), matchId, address ?? null);
      return true;
    },
  }),
}));
