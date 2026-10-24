import { queryOptions } from "@tanstack/react-query";
import { graphql, request, type ResultOf } from "@/lib/graphql";

export type TournamentStatus = "OPEN_FOR_REGISTRATIONS" | "CLOSED_FOR_REGISTRATIONS" | "IN_PROGRESS" | "FINISHED";

export const statusLabels: Record<TournamentStatus, string> = {
  OPEN_FOR_REGISTRATIONS: "Åben for tilmeldinger",
  CLOSED_FOR_REGISTRATIONS: "Lukket for tilmeldinger",
  IN_PROGRESS: "I gang",
  FINISHED: "Afsluttet",
};

export const formatLabels = { SINGLE_ELIMINATION: "Single Elimination" } as const;

const TournamentsQuery = graphql(`
  query Tournaments {
    tournaments { id name pictureUrl startsAt maxTeams status published createdAt registrationCount }
  }
`);

export type TournamentListItem = ResultOf<typeof TournamentsQuery>["tournaments"][number];

export const tournamentsQuery = () =>
  queryOptions({ queryKey: ["tournaments"], queryFn: async () => (await request(TournamentsQuery)).tournaments });

const RegistrationFields = graphql(`
  fragment RegistrationFields on Registration {
    id createdAt captainId
    team { id name avatarUrl }
    players { id playertag avatarUrl }
  }
`);

const TournamentQuery = graphql(
  `
  query Tournament($id: Int!) {
    tournament(id: $id) {
      id name pictureUrl description rules format startsAt maxTeams status published createdAt
      registrations { ...RegistrationFields }
    }
  }
`,
  [RegistrationFields],
);

export type TournamentDetails = NonNullable<ResultOf<typeof TournamentQuery>["tournament"]>;
export type Registration = TournamentDetails["registrations"][number];

export const tournamentQuery = (id: number) =>
  queryOptions({ queryKey: ["tournament", id], queryFn: async () => (await request(TournamentQuery, { id })).tournament });

const BracketQuery = graphql(`
  query Bracket($id: Int!) {
    tournament(id: $id) { id matches { id position phase winner registration1Id registration2Id } }
  }
`);

export type BracketMatch = NonNullable<ResultOf<typeof BracketQuery>["tournament"]>["matches"][number];

export const bracketQuery = (id: number) =>
  queryOptions({
    queryKey: ["bracket", id],
    queryFn: async () => (await request(BracketQuery, { id })).tournament?.matches ?? [],
  });

const MyRegistrationQuery = graphql(
  `
  query MyRegistration($tournamentId: Int!) { myRegistration(tournamentId: $tournamentId) { ...RegistrationFields } }
`,
  [RegistrationFields],
);

/** The registration (team + roster) the current player belongs to in a tournament. */
export const myRegistrationQuery = (tournamentId: number, userId: string) =>
  queryOptions({
    queryKey: ["registration", tournamentId, userId],
    queryFn: async () => (await request(MyRegistrationQuery, { tournamentId })).myRegistration,
  });

export const TournamentChangedSubscription = graphql(`
  subscription TournamentChanged($tournamentId: Int!) { tournamentChanged(tournamentId: $tournamentId) }
`);

const RegisterMutation = graphql(`
  mutation Register($tournamentId: Int!, $teamId: Int!) { registerForTournament(tournamentId: $tournamentId, teamId: $teamId) { id } }
`);

export async function registerForTournament(tournamentId: number, teamId: number) {
  await request(RegisterMutation, { tournamentId, teamId });
}

const LeaveTournamentMutation = graphql(`
  mutation LeaveTournament($tournamentId: Int!) { leaveTournament(tournamentId: $tournamentId) }
`);

export async function leaveTournament(tournamentId: number) {
  await request(LeaveTournamentMutation, { tournamentId });
}

const RemoveRegistrationMutation = graphql(`
  mutation RemoveRegistration($registrationId: Int!) { removeRegistration(registrationId: $registrationId) }
`);

export async function removeRegistration(registrationId: number) {
  await request(RemoveRegistrationMutation, { registrationId });
}

// --- Staff -----------------------------------------------------------------

export type TournamentInput = {
  name: string;
  description: string;
  rules: string;
  startsAt: string;
  maxTeams: number;
  published: boolean;
  status?: TournamentStatus | null;
};

const CreateTournamentMutation = graphql(`
  mutation CreateTournament($input: TournamentInput!) { createTournament(input: $input) { id } }
`);

export async function createTournament(input: TournamentInput): Promise<number> {
  return (await request(CreateTournamentMutation, { input })).createTournament.id;
}

const UpdateTournamentMutation = graphql(`
  mutation UpdateTournament($id: Int!, $input: TournamentInput!) { updateTournament(id: $id, input: $input) { id } }
`);

export async function updateTournament(id: number, input: TournamentInput) {
  await request(UpdateTournamentMutation, { id, input });
}

const SetPublishedMutation = graphql(`
  mutation SetTournamentPublished($id: Int!, $published: Boolean!) { setTournamentPublished(id: $id, published: $published) { id } }
`);

export async function setTournamentPublished(id: number, published: boolean) {
  await request(SetPublishedMutation, { id, published });
}

const DeleteTournamentMutation = graphql(`
  mutation DeleteTournament($id: Int!) { deleteTournament(id: $id) }
`);

export async function deleteTournament(id: number) {
  await request(DeleteTournamentMutation, { id });
}

const GenerateBracketMutation = graphql(`
  mutation GenerateBracket($tournamentId: Int!) { generateBracket(tournamentId: $tournamentId) }
`);

export async function generateBracket(tournamentId: number) {
  await request(GenerateBracketMutation, { tournamentId });
}

const StartTournamentMutation = graphql(`
  mutation StartTournament($tournamentId: Int!) { startTournament(tournamentId: $tournamentId) }
`);

export async function startTournament(tournamentId: number) {
  await request(StartTournamentMutation, { tournamentId });
}
