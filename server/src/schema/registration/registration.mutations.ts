import { builder, currentUser, loggedIn } from "../builder.js";
import * as registrations from "./registration.service.js";
import { RegistrationRef } from "./registration.model.js";

builder.mutationFields((t) => ({
  registerForTournament: t.field({
    type: RegistrationRef,
    authScopes: loggedIn,
    args: { tournamentId: t.arg.int({ required: true }), teamId: t.arg.int({ required: true }) },
    resolve: (_root, args, context) =>
      registrations.registerForTournament(currentUser(context), args.tournamentId, args.teamId),
  }),
  leaveTournament: t.boolean({
    authScopes: loggedIn,
    args: { tournamentId: t.arg.int({ required: true }) },
    resolve: async (_root, { tournamentId }, context) => {
      await registrations.leaveTournament(currentUser(context), tournamentId);
      return true;
    },
  }),
  removeRegistration: t.boolean({
    authScopes: loggedIn,
    args: { registrationId: t.arg.int({ required: true }) },
    resolve: async (_root, { registrationId }, context) => {
      await registrations.removeRegistration(currentUser(context), registrationId);
      return true;
    },
  }),
}));
