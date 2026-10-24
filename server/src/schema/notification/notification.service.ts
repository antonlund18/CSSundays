import { prisma } from "../../db.js";
import type { User } from "../../generated/prisma/client.js";
import { events } from "../../lib/pubsub.js";

export async function markNotificationsSeen(user: User) {
  await prisma.notification.updateMany({ where: { recipientId: user.id, seen: false }, data: { seen: true } });
  events.notification(user.id);
}
