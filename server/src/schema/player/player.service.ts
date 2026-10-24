import { prisma } from "../../db.js";
import type { User, UserRole } from "../../generated/prisma/client.js";
import { fail } from "../../lib/errors.js";
import { deleteImage, storeImage } from "../../lib/storage.js";
import { MAX_DESCRIPTION_LENGTH } from "../../lib/validation.js";
import { isStaff } from "../auth/auth.service.js";

export async function updateProfile(user: User, description: string) {
  if (description.length > MAX_DESCRIPTION_LENGTH) fail("INVALID_INPUT");
  return prisma.user.update({ where: { id: user.id }, data: { description: description.trim() } });
}

export async function setUserRole(user: User, userId: string, role: UserRole) {
  if (user.role !== "ADMIN") fail("FORBIDDEN");
  if (userId === user.id && role !== "ADMIN") fail("CANNOT_DEMOTE_SELF");
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) fail("NOT_FOUND");
  return prisma.user.update({ where: { id: userId }, data: { role } });
}

export type ImageTarget = { kind: "AVATAR" } | { kind: "TEAM"; id: number } | { kind: "TOURNAMENT"; id: number };

/** Stores a new picture and replaces the old one. Owners only. */
export async function uploadPicture(user: User, target: ImageTarget, file: File) {
  switch (target.kind) {
    case "AVATAR": {
      const path = await storeImage("avatars", user.id, file);
      await prisma.user.update({ where: { id: user.id }, data: { avatarPath: path } });
      await deleteImage(user.avatarPath);
      return path;
    }
    case "TEAM": {
      const team = await prisma.team.findUnique({ where: { id: target.id } });
      if (!team) fail("NOT_FOUND");
      if (team.ownerId !== user.id) fail("FORBIDDEN");
      const path = await storeImage("teams", team.id, file);
      await prisma.team.update({ where: { id: team.id }, data: { avatarPath: path } });
      await deleteImage(team.avatarPath);
      return path;
    }
    case "TOURNAMENT": {
      if (!isStaff(user)) fail("FORBIDDEN");
      const tournament = await prisma.tournament.findUnique({ where: { id: target.id } });
      if (!tournament) fail("NOT_FOUND");
      const path = await storeImage("tournaments", tournament.id, file);
      await prisma.tournament.update({ where: { id: tournament.id }, data: { picturePath: path } });
      await deleteImage(tournament.picturePath);
      return path;
    }
  }
}
