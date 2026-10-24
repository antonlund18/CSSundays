import { queryOptions } from "@tanstack/react-query";
import { graphql, request, type ResultOf } from "@/lib/graphql";

const NotificationsQuery = graphql(`
  query Notifications {
    notifications {
      id type seen createdAt
      invite { id status team { id name avatarUrl } sender { id playertag } }
    }
  }
`);

export type AppNotification = ResultOf<typeof NotificationsQuery>["notifications"][number];

export const notificationsQuery = (userId: string) =>
  queryOptions({ queryKey: ["notifications", userId], queryFn: async () => (await request(NotificationsQuery)).notifications });

export const NotificationsChangedSubscription = graphql(`
  subscription NotificationsChanged { notificationsChanged }
`);

const MarkSeenMutation = graphql(`mutation MarkNotificationsSeen { markNotificationsSeen }`);

export async function markNotificationsSeen() {
  await request(MarkSeenMutation);
}
