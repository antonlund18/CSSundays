import { queryOptions } from "@tanstack/react-query";
import { banTurn } from "@/lib/bracket";
import { formatDateTime } from "@/lib/format";
import { graphql, request, type ResultOf } from "@/lib/graphql";

const SideFields = graphql(`
  fragment ActivitySide on Registration { id team { id name avatarUrl } }
`);

const ActivityQuery = graphql(
  `
  query MyActivity {
    myActiveRegistrations {
      id captainId
      tournament { id name pictureUrl status startsAt }
      currentMatch {
        id phase phaseEndsAt team1Ready team2Ready firstBanTeam serverAddress registration1Id registration2Id
        registration1 { ...ActivitySide }
        registration2 { ...ActivitySide }
        bans { id }
      }
    }
  }
`,
  [SideFields],
);

export type ActiveRegistration = ResultOf<typeof ActivityQuery>["myActiveRegistrations"][number];
export type ActiveMatch = NonNullable<ActiveRegistration["currentMatch"]>;

export const activityQuery = (userId: string) =>
  queryOptions({
    queryKey: ["activity", userId],
    queryFn: async () => (await request(ActivityQuery)).myActiveRegistrations,
  });

export const MyActivityChangedSubscription = graphql(`
  subscription MyActivityChanged { myActivityChanged }
`);

export type ActivityStatus = {
  text: string;
  /** The player has to do something (ready up, ban a map, join the server). */
  action: boolean;
  /** Deadline of the ready check / ban turn. */
  endsAt: string | null;
  /** Server address to join, once the match is live. */
  connect: string | null;
};

/** What the player should know or do next in a tournament. */
export function activityStatus(registration: ActiveRegistration, userId: string): ActivityStatus {
  const status = (text: string, extra: Partial<ActivityStatus> = {}): ActivityStatus => ({
    text,
    action: false,
    endsAt: null,
    connect: null,
    ...extra,
  });
  const match = registration.currentMatch;
  const { tournament } = registration;

  if (!match) {
    if (tournament.status === "OPEN_FOR_REGISTRATIONS") return status(`Tilmeldt · starter ${formatDateTime(tournament.startsAt)}`);
    if (tournament.status === "CLOSED_FOR_REGISTRATIONS") return status("Venter på at turneringen starter");
    return status("Ude af turneringen");
  }

  const side = match.registration1Id === registration.id ? 1 : 2;
  const isCaptain = registration.captainId === userId;

  switch (match.phase) {
    case "READY_CHECK": {
      const endsAt = match.phaseEndsAt;
      if (side === 1 ? match.team1Ready : match.team2Ready) return status("Venter på at modstanderen melder klar", { endsAt });
      if (isCaptain) return status("Meld klar til kampen", { action: true, endsAt });
      return status("Venter på at kaptajnen melder klar", { endsAt });
    }
    case "PICK_AND_BAN": {
      const endsAt = match.phaseEndsAt;
      if (banTurn(match.firstBanTeam ?? 1, match.bans.length) !== side) return status("Modstanderen banner et kort", { endsAt });
      if (isCaptain) return status("Din tur til at banne et kort", { action: true, endsAt });
      return status("Kaptajnen banner et kort", { endsAt });
    }
    case "IN_PROGRESS":
      return match.serverAddress
        ? status("Join serveren", { action: true, connect: match.serverAddress })
        : status("Serveren bliver klargjort");
    case "WAITING_TO_START":
      return status("Venter på at turneringen starter");
    default:
      return status("Venter på modstander");
  }
}

export function opponentOf(registration: ActiveRegistration) {
  const match = registration.currentMatch;
  if (!match) return null;
  return match.registration1Id === registration.id ? match.registration2 : match.registration1;
}
