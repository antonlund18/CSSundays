import { imageUrl } from "../../lib/storage.js";
import { builder } from "../builder.js";
import { UserRef } from "../player/player.model.js";

export const TeamRef = builder.prismaObject("Team", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    avatarUrl: t.string({ nullable: true, select: { avatarPath: true }, resolve: (team) => imageUrl(team.avatarPath) }),
    wins: t.exposeInt("wins"),
    losses: t.exposeInt("losses"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    ownerId: t.exposeID("ownerId"),
    owner: t.relation("owner"),
    memberCount: t.relationCount("members"),
    members: t.field({
      type: [UserRef],
      select: { members: { select: { user: true }, orderBy: { joinedAt: "asc" } } },
      resolve: (team) => team.members.map((member) => member.user),
    }),
  }),
});

// Lives here rather than in player.model.ts so the two model files don't import each other.
builder.prismaObjectField(UserRef, "teams", (t) =>
  t.field({
    type: [TeamRef],
    select: { memberships: { select: { team: true }, orderBy: { joinedAt: "asc" } } },
    resolve: (user) => user.memberships.map((membership) => membership.team),
  }),
);
