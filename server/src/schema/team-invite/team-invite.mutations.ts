import { builder, currentUser, loggedIn } from "../builder.js";
import * as invites from "./team-invite.service.js";
import { TeamInviteRef } from "./team-invite.model.js";

builder.mutationFields((t) => ({
  inviteToTeam: t.field({
    type: TeamInviteRef,
    authScopes: loggedIn,
    args: { teamId: t.arg.int({ required: true }), recipientId: t.arg.id({ required: true }) },
    resolve: (_root, args, context) => invites.inviteToTeam(currentUser(context), args.teamId, String(args.recipientId)),
  }),
  respondToInvite: t.field({
    type: TeamInviteRef,
    authScopes: loggedIn,
    args: { inviteId: t.arg.int({ required: true }), accept: t.arg.boolean({ required: true }) },
    resolve: (_root, args, context) => invites.respondToInvite(currentUser(context), args.inviteId, args.accept),
  }),
}));
