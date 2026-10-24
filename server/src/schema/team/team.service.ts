import { prisma } from "../../db.js";
import type { User } from "../../generated/prisma/client.js";
import { fail, isUniqueViolation } from "../../lib/errors.js";

export const isMember = async (teamId: number, userId: string) =>
  !!(await prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId } } }));

export async function createTeam(user: User, rawName: string) {
  const name = rawName.trim();
  if (name.length < 2 || name.length > 32) fail("INVALID_TEAM_NAME");
  try {
    return await prisma.team.create({
      data: { name, nameKey: name.toLowerCase(), ownerId: user.id, members: { create: { userId: user.id } } },
    });
  } catch (error) {
    if (isUniqueViolation(error)) fail("TEAM_NAME_IN_USE");
    throw error;
  }
}

export async function leaveTeam(user: User, teamId: number) {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) fail("NOT_FOUND");
  if (team.ownerId === user.id) fail("OWNER_CANNOT_LEAVE");
  const { count } = await prisma.teamMember.deleteMany({ where: { teamId, userId: user.id } });
  if (count === 0) fail("NOT_TEAM_MEMBER");
}

export async function removeTeamMember(user: User, teamId: number, memberId: string) {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) fail("NOT_FOUND");
  if (team.ownerId !== user.id) fail("FORBIDDEN");
  if (memberId === user.id) fail("OWNER_CANNOT_LEAVE");
  await prisma.teamMember.deleteMany({ where: { teamId, userId: memberId } });
}
