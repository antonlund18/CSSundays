import { builder, currentUser, staff } from "../builder.js";
import * as tournaments from "./tournament.service.js";
import { TournamentInput, TournamentRef } from "./tournament.model.js";

builder.mutationFields((t) => ({
  createTournament: t.field({
    type: TournamentRef,
    authScopes: staff,
    args: { input: t.arg({ type: TournamentInput, required: true }) },
    resolve: (_root, { input }, context) => tournaments.createTournament(currentUser(context), input),
  }),
  updateTournament: t.field({
    type: TournamentRef,
    authScopes: staff,
    args: { id: t.arg.int({ required: true }), input: t.arg({ type: TournamentInput, required: true }) },
    resolve: (_root, { id, input }, context) => tournaments.updateTournament(currentUser(context), id, input),
  }),
  setTournamentPublished: t.field({
    type: TournamentRef,
    authScopes: staff,
    args: { id: t.arg.int({ required: true }), published: t.arg.boolean({ required: true }) },
    resolve: (_root, { id, published }, context) => tournaments.updateTournament(currentUser(context), id, { published }),
  }),
  deleteTournament: t.boolean({
    authScopes: staff,
    args: { id: t.arg.int({ required: true }) },
    resolve: async (_root, { id }, context) => {
      await tournaments.deleteTournament(currentUser(context), id);
      return true;
    },
  }),
  generateBracket: t.boolean({
    authScopes: staff,
    args: { tournamentId: t.arg.int({ required: true }) },
    resolve: async (_root, { tournamentId }, context) => {
      await tournaments.generateBracket(currentUser(context), tournamentId);
      return true;
    },
  }),
  startTournament: t.boolean({
    authScopes: staff,
    args: { tournamentId: t.arg.int({ required: true }) },
    resolve: async (_root, { tournamentId }, context) => {
      await tournaments.startTournament(currentUser(context), tournamentId);
      return true;
    },
  }),
}));
