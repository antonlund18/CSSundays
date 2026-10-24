import { prisma } from "../../db.js";
import type { User } from "../../generated/prisma/client.js";
import { fail } from "../../lib/errors.js";
import { events } from "../../lib/pubsub.js";
import { MAX_CHAT_MESSAGE_LENGTH } from "../../lib/validation.js";
import { isStaff } from "../auth/auth.service.js";
import { isParticipant } from "../match/match.service.js";

export async function sendChatMessage(user: User, matchId: number, rawMessage: string) {
  const message = rawMessage.trim();
  if (message.length === 0 || message.length > MAX_CHAT_MESSAGE_LENGTH) fail("INVALID_INPUT");
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) fail("NOT_FOUND");
  if (!isStaff(user) && !(await isParticipant(user.id, match))) fail("FORBIDDEN");
  const created = await prisma.matchChatMessage.create({ data: { matchId, senderId: user.id, message } });
  events.chatMessage(matchId);
  return created;
}
