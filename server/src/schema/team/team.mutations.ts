import { builder, currentUser, loggedIn } from "../builder.js";
import * as teams from "./team.service.js";
import { TeamRef } from "./team.model.js";

builder.mutationFields((t) => ({
  createTeam: t.field({
    type: TeamRef,
    authScopes: loggedIn,
    args: { name: t.arg.string({ required: true }) },
    resolve: (_root, { name }, context) => teams.createTeam(currentUser(context), name),
  }),
  leaveTeam: t.boolean({
    authScopes: loggedIn,
    args: { teamId: t.arg.int({ required: true }) },
    resolve: async (_root, { teamId }, context) => {
      await teams.leaveTeam(currentUser(context), teamId);
      return true;
    },
  }),
  removeTeamMember: t.boolean({
    authScopes: loggedIn,
    args: { teamId: t.arg.int({ required: true }), userId: t.arg.id({ required: true }) },
    resolve: async (_root, args, context) => {
      await teams.removeTeamMember(currentUser(context), args.teamId, String(args.userId));
      return true;
    },
  }),
}));
