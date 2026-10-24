import { queryOptions } from "@tanstack/react-query";
import { graphql, request, type ResultOf } from "@/lib/graphql";

export type MatchPhase =
  | "WAITING_FOR_TEAMS"
  | "WAITING_TO_START"
  | "READY_CHECK"
  | "PICK_AND_BAN"
  | "IN_PROGRESS"
  | "FINISHED"
  | "CANCELLED";

export const phaseLabels: Record<MatchPhase, string> = {
  WAITING_FOR_TEAMS: "Venter på hold",
  WAITING_TO_START: "Venter på at starte",
  READY_CHECK: "Klar-tjek",
  PICK_AND_BAN: "Map veto",
  IN_PROGRESS: "I gang",
  FINISHED: "Afsluttet",
  CANCELLED: "Aflyst",
};

const SideFields = graphql(`
  fragment SideFields on Registration {
    id captainId
    team { id name avatarUrl }
    players { id playertag avatarUrl }
  }
`);

const MatchQuery = graphql(
  `
  query Match($id: Int!) {
    match(id: $id) {
      id tournamentId position phase phaseEndsAt team1Ready team2Ready firstBanTeam mapSlug winner serverAddress
      tournament { id name status }
      registration1 { ...SideFields }
      registration2 { ...SideFields }
      bans { id ordinal mapSlug team automatic }
    }
  }
`,
  [SideFields],
);

export type MatchDetails = NonNullable<ResultOf<typeof MatchQuery>["match"]>;
export type MatchSide = NonNullable<MatchDetails["registration1"]>;

export const matchQuery = (id: number) =>
  queryOptions({ queryKey: ["match", id], queryFn: async () => (await request(MatchQuery, { id })).match });

const MapsQuery = graphql(`
  query Maps { maps { slug name imageUrl active sortOrder } }
`);

export type GameMap = ResultOf<typeof MapsQuery>["maps"][number];

export const mapsQuery = () =>
  queryOptions({ queryKey: ["maps"], staleTime: 5 * 60_000, queryFn: async () => (await request(MapsQuery)).maps });

const ChatQuery = graphql(`
  query MatchChat($matchId: Int!) { matchChat(matchId: $matchId) { id message createdAt sender { id playertag } } }
`);

export const chatQuery = (matchId: number) =>
  queryOptions({ queryKey: ["chat", matchId], queryFn: async () => (await request(ChatQuery, { matchId })).matchChat });

export const MatchChangedSubscription = graphql(`
  subscription MatchChanged($matchId: Int!) { matchChanged(matchId: $matchId) }
`);

export const ChatMessageAddedSubscription = graphql(`
  subscription ChatMessageAdded($matchId: Int!) { chatMessageAdded(matchId: $matchId) }
`);

const MarkReadyMutation = graphql(`mutation MarkReady($matchId: Int!) { markReady(matchId: $matchId) }`);
export async function markReady(matchId: number) {
  await request(MarkReadyMutation, { matchId });
}

const BanMapMutation = graphql(`mutation BanMap($matchId: Int!, $map: String!) { banMap(matchId: $matchId, map: $map) }`);
export async function banMap(matchId: number, map: string) {
  await request(BanMapMutation, { matchId, map });
}

const SendChatMutation = graphql(`
  mutation SendChatMessage($matchId: Int!, $message: String!) { sendChatMessage(matchId: $matchId, message: $message) { id } }
`);
export async function sendChatMessage(matchId: number, message: string) {
  await request(SendChatMutation, { matchId, message });
}

const ReportWinnerMutation = graphql(`
  mutation ReportMatchWinner($matchId: Int!, $winner: Int!) { reportMatchWinner(matchId: $matchId, winner: $winner) }
`);
export async function reportWinner(matchId: number, winner: 1 | 2) {
  await request(ReportWinnerMutation, { matchId, winner });
}

const RestartMatchMutation = graphql(`mutation RestartMatch($matchId: Int!) { restartMatch(matchId: $matchId) }`);
export async function restartMatch(matchId: number) {
  await request(RestartMatchMutation, { matchId });
}

const SetServerMutation = graphql(`
  mutation SetMatchServer($matchId: Int!, $address: String) { setMatchServer(matchId: $matchId, address: $address) }
`);
export async function setMatchServer(matchId: number, address: string) {
  await request(SetServerMutation, { matchId, address });
}

const AddMapMutation = graphql(`mutation AddMap($name: String!, $imageUrl: String) { addMap(name: $name, imageUrl: $imageUrl) { slug } }`);
export async function addMap(name: string, imageUrl: string) {
  await request(AddMapMutation, { name, imageUrl: imageUrl || null });
}

const UpdateMapMutation = graphql(`
  mutation UpdateMap($slug: String!, $active: Boolean, $imageUrl: String) { updateMap(slug: $slug, active: $active, imageUrl: $imageUrl) { slug } }
`);
export async function updateMap(slug: string, changes: { active?: boolean; imageUrl?: string }) {
  await request(UpdateMapMutation, { slug, active: changes.active ?? null, imageUrl: changes.imageUrl ?? null });
}
