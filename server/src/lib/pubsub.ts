import { createPubSub } from "graphql-yoga";

/**
 * In-process events for GraphQL subscriptions. Clients use them as "something
 * changed" signals and refetch the affected queries.
 */
export const pubsub = createPubSub<{
  "match:changed": [matchId: number, payload: true];
  "chat:message": [matchId: number, payload: true];
  "tournament:changed": [tournamentId: number, payload: true];
  "user:notification": [userId: string, payload: true];
  "user:activity": [userId: string, payload: true];
}>();

export const events = {
  matchChanged(matchId: number, tournamentId: number) {
    pubsub.publish("match:changed", matchId, true);
    pubsub.publish("tournament:changed", tournamentId, true);
  },
  tournamentChanged(tournamentId: number) {
    pubsub.publish("tournament:changed", tournamentId, true);
  },
  chatMessage(matchId: number) {
    pubsub.publish("chat:message", matchId, true);
  },
  notification(userId: string) {
    pubsub.publish("user:notification", userId, true);
  },
  /** The players' active tournaments or matches changed (drives the activity sidebar). */
  activity(userIds: Iterable<string>) {
    for (const userId of new Set(userIds)) pubsub.publish("user:activity", userId, true);
  },
};
