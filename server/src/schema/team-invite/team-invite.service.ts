import { prisma } from "../../db.js";
import type { User } from "../../generated/prisma/client.js";
import { fail, isUniqueViolation } from "../../lib/errors.js";
import { events } from "../../lib/pubsub.js";
import { isMember } from "../team/team.service.js";

export async function inviteToTeam(user: User, teamId: number, recipientId: string) {
  if (!(await isMember(teamId, user.id))) fail("NOT_TEAM_MEMBER");
  if (!(await prisma.user.findUnique({ where: { id: recipientId }, select: { id: true } }))) fail("NOT_FOUND");
  if (await isMember(teamId, recipientId)) fail("ALREADY_TEAM_MEMBER");

  try {
    const invite = await prisma.teamInvite.create({
      data: {
        teamId,
        senderId: user.id,
        recipientId,
        notifications: { create: { recipientId, type: "INVITE_TO_TEAM" } },
      },
    });
    events.notification(recipientId);
    return invite;
  } catch (error) {
    // The partial unique index allows one pending invite per team and player.
    if (isUniqueViolation(error)) fail("INVITE_ALREADY_PENDING");
    throw error;
  }
}

export async function respondToInvite(user: User, inviteId: number, accept: boolean) {
  const invite = await prisma.$transaction(async (tx) => {
    const invite = await tx.teamInvite.findUnique({ where: { id: inviteId } });
    if (!invite || invite.recipientId !== user.id) fail("NOT_FOUND");
    // Only flip a pending invite, so two quick clicks cannot both succeed.
    const { count } = await tx.teamInvite.updateMany({
      where: { id: inviteId, status: "PENDING" },
      data: { status: accept ? "ACCEPTED" : "DECLINED", respondedAt: new Date() },
    });
    if (count === 0) fail("INVITE_NOT_PENDING");
    if (accept) {
      await tx.teamMember.upsert({
        where: { teamId_userId: { teamId: invite.teamId, userId: user.id } },
        create: { teamId: invite.teamId, userId: user.id },
        update: {},
      });
    }
    await tx.notification.updateMany({ where: { inviteId, recipientId: user.id }, data: { seen: true } });
    return tx.teamInvite.findUniqueOrThrow({ where: { id: inviteId } });
  });
  events.notification(user.id);
  return invite;
}
