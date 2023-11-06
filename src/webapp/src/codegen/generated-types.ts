import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** DateTime */
  LocalDateTime: any;
};

export type Bracket = {
  __typename?: 'Bracket';
  createdTs: Scalars['LocalDateTime'];
  id?: Maybe<Scalars['Int']>;
  root?: Maybe<Match>;
  tournament?: Maybe<Tournament>;
};

export type HeaderDto = {
  __typename?: 'HeaderDTO';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type InviteToTeam = NotifiableObject & {
  __typename?: 'InviteToTeam';
  createdTs: Scalars['LocalDateTime'];
  id?: Maybe<Scalars['Int']>;
  recipient: User;
  sender: User;
  status: InviteToTeamStatus;
  team: Team;
};

export enum InviteToTeamStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type Match = {
  __typename?: 'Match';
  createdTs: Scalars['LocalDateTime'];
  id?: Maybe<Scalars['Int']>;
  left?: Maybe<Match>;
  parent?: Maybe<Match>;
  result: MatchResult;
  right?: Maybe<Match>;
  team1?: Maybe<Team>;
  team2?: Maybe<Team>;
};

export enum MatchResult {
  Cancelled = 'CANCELLED',
  ComingUp = 'COMING_UP',
  InProgress = 'IN_PROGRESS',
  WinTeam_1 = 'WIN_TEAM_1',
  WinTeam_2 = 'WIN_TEAM_2'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation?: Maybe<InviteToTeam>;
  createInviteToTeam?: Maybe<InviteToTeam>;
  createNotification?: Maybe<Notification>;
  createTeam?: Maybe<Team>;
  createTournament?: Maybe<Tournament>;
  createUser: Scalars['String'];
  declineInvitation?: Maybe<InviteToTeam>;
  deletePicture?: Maybe<User>;
  generateBracket?: Maybe<Tournament>;
  incrementLosses?: Maybe<Team>;
  incrementWins?: Maybe<Team>;
  loginUser: Scalars['String'];
  markAllNotificationsAsSeenForUser: Array<Notification>;
  registerTeam?: Maybe<Tournament>;
  setPictureAndGetPresignedRequest?: Maybe<RequestDto>;
};


export type MutationAcceptInvitationArgs = {
  invitationId: Scalars['Int'];
};


export type MutationCreateInviteToTeamArgs = {
  recipientId: Scalars['Int'];
  senderId: Scalars['Int'];
  teamId: Scalars['Int'];
};


export type MutationCreateNotificationArgs = {
  notificationType: NotificationType;
  recipientId: Scalars['Int'];
};


export type MutationCreateTeamArgs = {
  name: Scalars['String'];
  ownerId: Scalars['Int'];
};


export type MutationCreateTournamentArgs = {
  date: Scalars['LocalDateTime'];
  description: Scalars['String'];
  format: TournamentFormat;
  name: Scalars['String'];
  numberOfTeamsAllowed: Scalars['Int'];
  picture?: InputMaybe<Scalars['String']>;
  rules: Scalars['String'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  playertag: Scalars['String'];
};


export type MutationDeclineInvitationArgs = {
  invitationId: Scalars['Int'];
};


export type MutationDeletePictureArgs = {
  userId: Scalars['Int'];
};


export type MutationGenerateBracketArgs = {
  tournamentId: Scalars['Int'];
};


export type MutationIncrementLossesArgs = {
  teamId: Scalars['Int'];
};


export type MutationIncrementWinsArgs = {
  teamId: Scalars['Int'];
};


export type MutationLoginUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationMarkAllNotificationsAsSeenForUserArgs = {
  userId: Scalars['Int'];
};


export type MutationRegisterTeamArgs = {
  teamId: Scalars['Int'];
  tournamentId: Scalars['Int'];
};


export type MutationSetPictureAndGetPresignedRequestArgs = {
  id: Scalars['Int'];
  objectType: ObjectType;
};

export type NotifiableObject = {
  id?: Maybe<Scalars['Int']>;
};

export type Notification = {
  __typename?: 'Notification';
  createdTs: Scalars['LocalDateTime'];
  id?: Maybe<Scalars['Int']>;
  isSeen: Scalars['Boolean'];
  notifiableObject?: Maybe<NotifiableObject>;
  notificationType: NotificationType;
  recipient: User;
};

export enum NotificationType {
  InviteToTeam = 'INVITE_TO_TEAM'
}

export enum ObjectType {
  Team = 'TEAM',
  Tournament = 'TOURNAMENT',
  User = 'USER'
}

export type Query = {
  __typename?: 'Query';
  findAllInvitesForPlayer: Array<InviteToTeam>;
  findPendingInvitesForPlayer: Array<InviteToTeam>;
  getAllNotifications: Array<Notification>;
  getAllTeams: Array<Team>;
  getAllTournaments: Array<Tournament>;
  getAllUsers: Array<User>;
  getBracket?: Maybe<Bracket>;
  getCurrentUser?: Maybe<User>;
  getFirstRoundMatches?: Maybe<Array<Match>>;
  getMatchesByParentIds: Array<Match>;
  getTeamById?: Maybe<Team>;
  getTournamentById?: Maybe<Tournament>;
  getUnseenNotifications: Array<Notification>;
  getUserById?: Maybe<User>;
  getUserBySlug?: Maybe<User>;
};


export type QueryFindAllInvitesForPlayerArgs = {
  playerId: Scalars['Int'];
};


export type QueryFindPendingInvitesForPlayerArgs = {
  playerId: Scalars['Int'];
};


export type QueryGetAllNotificationsArgs = {
  userId: Scalars['Int'];
};


export type QueryGetBracketArgs = {
  tournamentId: Scalars['Int'];
};


export type QueryGetCurrentUserArgs = {
  token: Scalars['String'];
};


export type QueryGetFirstRoundMatchesArgs = {
  tournamentId: Scalars['Int'];
};


export type QueryGetMatchesByParentIdsArgs = {
  parentIds: Array<Scalars['Int']>;
};


export type QueryGetTeamByIdArgs = {
  teamId: Scalars['Int'];
};


export type QueryGetTournamentByIdArgs = {
  id: Scalars['Int'];
};


export type QueryGetUnseenNotificationsArgs = {
  userId: Scalars['Int'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['Int'];
};


export type QueryGetUserBySlugArgs = {
  slug: Scalars['String'];
};

export type RequestDto = {
  __typename?: 'RequestDTO';
  headers: Array<HeaderDto>;
  method: Scalars['String'];
  url: Scalars['String'];
};

export type Team = {
  __typename?: 'Team';
  createdTs: Scalars['LocalDateTime'];
  id?: Maybe<Scalars['Int']>;
  losses: Scalars['Int'];
  name: Scalars['String'];
  owner: User;
  picture?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  users: Array<User>;
  wins: Scalars['Int'];
};

export type Tournament = {
  __typename?: 'Tournament';
  bracket?: Maybe<Bracket>;
  createdTs: Scalars['LocalDateTime'];
  description: Scalars['String'];
  format: TournamentFormat;
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  numberOfTeamsAllowed: Scalars['Int'];
  picture?: Maybe<Scalars['String']>;
  published: Scalars['Boolean'];
  rules: Scalars['String'];
  startDateAndTime: Scalars['LocalDateTime'];
  status: TournamentStatus;
  teamRegistrations: Array<TournamentRegistration>;
};

export enum TournamentFormat {
  SingleElimination = 'SINGLE_ELIMINATION'
}

export type TournamentRegistration = {
  __typename?: 'TournamentRegistration';
  createdTs: Scalars['LocalDateTime'];
  id?: Maybe<Scalars['Int']>;
  team: Team;
  tournament: Tournament;
};

export enum TournamentStatus {
  ClosedForRegistrations = 'CLOSED_FOR_REGISTRATIONS',
  Finished = 'FINISHED',
  InProgress = 'IN_PROGRESS',
  OpenForRegistrations = 'OPEN_FOR_REGISTRATIONS'
}

export type User = {
  __typename?: 'User';
  createdTs: Scalars['LocalDateTime'];
  email: Scalars['String'];
  id?: Maybe<Scalars['Int']>;
  password: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  playertag: Scalars['String'];
  role: UserRole;
  slug: Scalars['String'];
  teams: Array<Team>;
};

export enum UserRole {
  Admin = 'ADMIN',
  None = 'NONE',
  Organizer = 'ORGANIZER',
  User = 'USER'
}

export type FindAllInvitesForPlayerQueryVariables = Exact<{
  playerId: Scalars['Int'];
}>;


export type FindAllInvitesForPlayerQuery = { __typename?: 'Query', findAllInvitesForPlayer: Array<{ __typename?: 'InviteToTeam', id?: number, status: InviteToTeamStatus, createdTs: any, recipient: { __typename?: 'User', id?: number, playertag: string, picture?: string }, team: { __typename?: 'Team', id?: number, name: string, picture?: string, owner: { __typename?: 'User', id?: number, playertag: string, picture?: string } }, sender: { __typename?: 'User', id?: number, playertag: string, picture?: string } }> };

export type FindPendingInvitesForPlayerQueryVariables = Exact<{
  playerId: Scalars['Int'];
}>;


export type FindPendingInvitesForPlayerQuery = { __typename?: 'Query', findPendingInvitesForPlayer: Array<{ __typename?: 'InviteToTeam', id?: number, status: InviteToTeamStatus, recipient: { __typename?: 'User', id?: number, playertag: string, picture?: string }, team: { __typename?: 'Team', id?: number, name: string, picture?: string, owner: { __typename?: 'User', id?: number, playertag: string, picture?: string }, users: Array<{ __typename?: 'User', id?: number }> }, sender: { __typename?: 'User', id?: number, playertag: string, picture?: string } }> };

export type AcceptInvitationMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type AcceptInvitationMutation = { __typename?: 'Mutation', acceptInvitation?: { __typename?: 'InviteToTeam', id?: number, status: InviteToTeamStatus, recipient: { __typename?: 'User', id?: number, playertag: string, picture?: string }, team: { __typename?: 'Team', id?: number, name: string, picture?: string, owner: { __typename?: 'User', id?: number, playertag: string, picture?: string } }, sender: { __typename?: 'User', id?: number, playertag: string, picture?: string } } };

export type DeclineInvitationMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeclineInvitationMutation = { __typename?: 'Mutation', declineInvitation?: { __typename?: 'InviteToTeam', id?: number, status: InviteToTeamStatus, recipient: { __typename?: 'User', id?: number, playertag: string, picture?: string }, team: { __typename?: 'Team', id?: number, name: string, picture?: string, owner: { __typename?: 'User', id?: number, playertag: string, picture?: string } }, sender: { __typename?: 'User', id?: number, playertag: string, picture?: string } } };

export type CreateInviteToTeamMutationVariables = Exact<{
  recipientId: Scalars['Int'];
  teamId: Scalars['Int'];
  senderId: Scalars['Int'];
}>;


export type CreateInviteToTeamMutation = { __typename?: 'Mutation', createInviteToTeam?: { __typename?: 'InviteToTeam', id?: number, status: InviteToTeamStatus } };

export type GetMatchesByParentIdsQueryVariables = Exact<{
  parentIds: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type GetMatchesByParentIdsQuery = { __typename?: 'Query', getMatchesByParentIds: Array<{ __typename?: 'Match', id?: number, team1?: { __typename?: 'Team', id?: number, name: string, picture?: string }, team2?: { __typename?: 'Team', id?: number, name: string, picture?: string } }> };

export type GetAllNotificationsQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type GetAllNotificationsQuery = { __typename?: 'Query', getAllNotifications: Array<{ __typename?: 'Notification', id?: number, isSeen: boolean, notificationType: NotificationType, createdTs: any, recipient: { __typename?: 'User', id?: number, playertag: string, picture?: string }, notifiableObject?: { __typename?: 'InviteToTeam', id?: number, createdTs: any, status: InviteToTeamStatus, recipient: { __typename?: 'User', id?: number, playertag: string, picture?: string }, sender: { __typename?: 'User', id?: number, playertag: string, picture?: string }, team: { __typename?: 'Team', id?: number, name: string, picture?: string } } }> };

export type MarkAllNotificationsAsSeenForUserMutationVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type MarkAllNotificationsAsSeenForUserMutation = { __typename?: 'Mutation', markAllNotificationsAsSeenForUser: Array<{ __typename?: 'Notification', id?: number, isSeen: boolean }> };

export type SetPictureAndGetPresignedRequestMutationVariables = Exact<{
  id: Scalars['Int'];
  objectType: ObjectType;
}>;


export type SetPictureAndGetPresignedRequestMutation = { __typename?: 'Mutation', setPictureAndGetPresignedRequest?: { __typename?: 'RequestDTO', url: string, method: string, headers: Array<{ __typename?: 'HeaderDTO', name: string, value: string }> } };

export type RegisterTeamMutationVariables = Exact<{
  tournamentId: Scalars['Int'];
  teamId: Scalars['Int'];
}>;


export type RegisterTeamMutation = { __typename?: 'Mutation', registerTeam?: { __typename?: 'Tournament', id?: number, teamRegistrations: Array<{ __typename?: 'TournamentRegistration', id?: number, team: { __typename?: 'Team', id?: number, name: string } }> } };

export type GetAllTeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTeamsQuery = { __typename?: 'Query', getAllTeams: Array<{ __typename?: 'Team', id?: number, name: string, picture?: string, wins: number, losses: number, createdTs: any }> };

export type GetTeamByIdQueryVariables = Exact<{
  teamId: Scalars['Int'];
}>;


export type GetTeamByIdQuery = { __typename?: 'Query', getTeamById?: { __typename?: 'Team', id?: number, name: string, picture?: string, wins: number, losses: number, createdTs: any, owner: { __typename?: 'User', id?: number, playertag: string, picture?: string }, users: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> } };

export type IncrementWinsMutationVariables = Exact<{
  teamId: Scalars['Int'];
}>;


export type IncrementWinsMutation = { __typename?: 'Mutation', incrementWins?: { __typename?: 'Team', id?: number, wins: number } };

export type IncrementLossesMutationVariables = Exact<{
  teamId: Scalars['Int'];
}>;


export type IncrementLossesMutation = { __typename?: 'Mutation', incrementLosses?: { __typename?: 'Team', id?: number, losses: number } };

export type CreateTeamMutationVariables = Exact<{
  name: Scalars['String'];
  ownerId: Scalars['Int'];
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', createTeam?: { __typename?: 'Team', id?: number, users: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> } };

export type CreateTournamentMutationVariables = Exact<{
  name: Scalars['String'];
  date: Scalars['LocalDateTime'];
  format: TournamentFormat;
  numberOfTeamsAllowed: Scalars['Int'];
  picture?: InputMaybe<Scalars['String']>;
  description: Scalars['String'];
  rules: Scalars['String'];
}>;


export type CreateTournamentMutation = { __typename?: 'Mutation', createTournament?: { __typename?: 'Tournament', id?: number, name: string, picture?: string, description: string, format: TournamentFormat, rules: string, startDateAndTime: any, numberOfTeamsAllowed: number, bracket?: { __typename?: 'Bracket', id?: number, root?: { __typename?: 'Match', id?: number, left?: { __typename?: 'Match', id?: number }, right?: { __typename?: 'Match', id?: number } } } } };

export type GetAllTournamentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTournamentsQuery = { __typename?: 'Query', getAllTournaments: Array<{ __typename?: 'Tournament', id?: number, name: string, picture?: string, description: string, format: TournamentFormat, startDateAndTime: any, numberOfTeamsAllowed: number, createdTs: any, status: TournamentStatus, published: boolean, bracket?: { __typename?: 'Bracket', id?: number, root?: { __typename?: 'Match', id?: number, left?: { __typename?: 'Match', id?: number }, right?: { __typename?: 'Match', id?: number } } }, teamRegistrations: Array<{ __typename?: 'TournamentRegistration', id?: number, team: { __typename?: 'Team', id?: number } }> }> };

export type GenerateBracketMutationVariables = Exact<{
  tournamentId: Scalars['Int'];
}>;


export type GenerateBracketMutation = { __typename?: 'Mutation', generateBracket?: { __typename?: 'Tournament', id?: number, bracket?: { __typename?: 'Bracket', id?: number, root?: { __typename?: 'Match', id?: number, result: MatchResult, left?: { __typename?: 'Match', id?: number }, right?: { __typename?: 'Match', id?: number }, parent?: { __typename?: 'Match', id?: number }, team1?: { __typename?: 'Team', id?: number, name: string }, team2?: { __typename?: 'Team', id?: number, name: string } } } } };

export type GetTournamentByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetTournamentByIdQuery = { __typename?: 'Query', getTournamentById?: { __typename?: 'Tournament', id?: number, name: string, picture?: string, description: string, format: TournamentFormat, startDateAndTime: any, numberOfTeamsAllowed: number, teamRegistrations: Array<{ __typename?: 'TournamentRegistration', id?: number, createdTs: any, team: { __typename?: 'Team', id?: number, name: string, picture?: string, users: Array<{ __typename?: 'User', id?: number, picture?: string, playertag: string }> } }>, bracket?: { __typename?: 'Bracket', id?: number, root?: { __typename?: 'Match', id?: number, team1?: { __typename?: 'Team', id?: number, name: string, picture?: string }, team2?: { __typename?: 'Team', id?: number, name: string, picture?: string } } } } };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById?: { __typename?: 'User', id?: number, playertag: string, email: string, role: UserRole, picture?: string, teams: Array<{ __typename?: 'Team', name: string, users: Array<{ __typename?: 'User', playertag: string }> }> } };

export type GetCurrentUserQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', id?: number, playertag: string, email: string, role: UserRole, picture?: string, teams: Array<{ __typename?: 'Team', id?: number, name: string, picture?: string, users: Array<{ __typename?: 'User', playertag: string }> }> } };

export type CreateUserMutationVariables = Exact<{
  playertag: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: string };

export type LoginUserMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: string };

export type NewNotificationFragment = { __typename?: 'Notification', id?: number, isSeen: boolean };

export const NewNotificationFragmentDoc = gql`
    fragment NewNotification on Notification {
  id
  isSeen
}
    `;
export const FindAllInvitesForPlayerDocument = gql`
    query findAllInvitesForPlayer($playerId: Int!) {
  findAllInvitesForPlayer(playerId: $playerId) {
    id
    recipient {
      id
      playertag
      picture
    }
    team {
      id
      name
      picture
      owner {
        id
        playertag
        picture
      }
    }
    status
    sender {
      id
      playertag
      picture
    }
    createdTs
  }
}
    `;

/**
 * __useFindAllInvitesForPlayerQuery__
 *
 * To run a query within a React component, call `useFindAllInvitesForPlayerQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllInvitesForPlayerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllInvitesForPlayerQuery({
 *   variables: {
 *      playerId: // value for 'playerId'
 *   },
 * });
 */
export function useFindAllInvitesForPlayerQuery(baseOptions: Apollo.QueryHookOptions<FindAllInvitesForPlayerQuery, FindAllInvitesForPlayerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllInvitesForPlayerQuery, FindAllInvitesForPlayerQueryVariables>(FindAllInvitesForPlayerDocument, options);
      }
export function useFindAllInvitesForPlayerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllInvitesForPlayerQuery, FindAllInvitesForPlayerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllInvitesForPlayerQuery, FindAllInvitesForPlayerQueryVariables>(FindAllInvitesForPlayerDocument, options);
        }
export type FindAllInvitesForPlayerQueryHookResult = ReturnType<typeof useFindAllInvitesForPlayerQuery>;
export type FindAllInvitesForPlayerLazyQueryHookResult = ReturnType<typeof useFindAllInvitesForPlayerLazyQuery>;
export type FindAllInvitesForPlayerQueryResult = Apollo.QueryResult<FindAllInvitesForPlayerQuery, FindAllInvitesForPlayerQueryVariables>;
export const FindPendingInvitesForPlayerDocument = gql`
    query findPendingInvitesForPlayer($playerId: Int!) {
  findPendingInvitesForPlayer(playerId: $playerId) {
    id
    recipient {
      id
      playertag
      picture
    }
    team {
      id
      name
      picture
      owner {
        id
        playertag
        picture
      }
      users {
        id
      }
    }
    status
    sender {
      id
      playertag
      picture
    }
  }
}
    `;

/**
 * __useFindPendingInvitesForPlayerQuery__
 *
 * To run a query within a React component, call `useFindPendingInvitesForPlayerQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindPendingInvitesForPlayerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindPendingInvitesForPlayerQuery({
 *   variables: {
 *      playerId: // value for 'playerId'
 *   },
 * });
 */
export function useFindPendingInvitesForPlayerQuery(baseOptions: Apollo.QueryHookOptions<FindPendingInvitesForPlayerQuery, FindPendingInvitesForPlayerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindPendingInvitesForPlayerQuery, FindPendingInvitesForPlayerQueryVariables>(FindPendingInvitesForPlayerDocument, options);
      }
export function useFindPendingInvitesForPlayerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindPendingInvitesForPlayerQuery, FindPendingInvitesForPlayerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindPendingInvitesForPlayerQuery, FindPendingInvitesForPlayerQueryVariables>(FindPendingInvitesForPlayerDocument, options);
        }
export type FindPendingInvitesForPlayerQueryHookResult = ReturnType<typeof useFindPendingInvitesForPlayerQuery>;
export type FindPendingInvitesForPlayerLazyQueryHookResult = ReturnType<typeof useFindPendingInvitesForPlayerLazyQuery>;
export type FindPendingInvitesForPlayerQueryResult = Apollo.QueryResult<FindPendingInvitesForPlayerQuery, FindPendingInvitesForPlayerQueryVariables>;
export const AcceptInvitationDocument = gql`
    mutation acceptInvitation($id: Int!) {
  acceptInvitation(invitationId: $id) {
    id
    recipient {
      id
      playertag
      picture
    }
    team {
      id
      name
      picture
      owner {
        id
        playertag
        picture
      }
    }
    status
    sender {
      id
      playertag
      picture
    }
  }
}
    `;
export type AcceptInvitationMutationFn = Apollo.MutationFunction<AcceptInvitationMutation, AcceptInvitationMutationVariables>;

/**
 * __useAcceptInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInvitationMutation, { data, loading, error }] = useAcceptInvitationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptInvitationMutation(baseOptions?: Apollo.MutationHookOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptInvitationMutation, AcceptInvitationMutationVariables>(AcceptInvitationDocument, options);
      }
export type AcceptInvitationMutationHookResult = ReturnType<typeof useAcceptInvitationMutation>;
export type AcceptInvitationMutationResult = Apollo.MutationResult<AcceptInvitationMutation>;
export type AcceptInvitationMutationOptions = Apollo.BaseMutationOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const DeclineInvitationDocument = gql`
    mutation declineInvitation($id: Int!) {
  declineInvitation(invitationId: $id) {
    id
    recipient {
      id
      playertag
      picture
    }
    team {
      id
      name
      picture
      owner {
        id
        playertag
        picture
      }
    }
    status
    sender {
      id
      playertag
      picture
    }
  }
}
    `;
export type DeclineInvitationMutationFn = Apollo.MutationFunction<DeclineInvitationMutation, DeclineInvitationMutationVariables>;

/**
 * __useDeclineInvitationMutation__
 *
 * To run a mutation, you first call `useDeclineInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeclineInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [declineInvitationMutation, { data, loading, error }] = useDeclineInvitationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeclineInvitationMutation(baseOptions?: Apollo.MutationHookOptions<DeclineInvitationMutation, DeclineInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeclineInvitationMutation, DeclineInvitationMutationVariables>(DeclineInvitationDocument, options);
      }
export type DeclineInvitationMutationHookResult = ReturnType<typeof useDeclineInvitationMutation>;
export type DeclineInvitationMutationResult = Apollo.MutationResult<DeclineInvitationMutation>;
export type DeclineInvitationMutationOptions = Apollo.BaseMutationOptions<DeclineInvitationMutation, DeclineInvitationMutationVariables>;
export const CreateInviteToTeamDocument = gql`
    mutation createInviteToTeam($recipientId: Int!, $teamId: Int!, $senderId: Int!) {
  createInviteToTeam(
    recipientId: $recipientId
    teamId: $teamId
    senderId: $senderId
  ) {
    id
    status
  }
}
    `;
export type CreateInviteToTeamMutationFn = Apollo.MutationFunction<CreateInviteToTeamMutation, CreateInviteToTeamMutationVariables>;

/**
 * __useCreateInviteToTeamMutation__
 *
 * To run a mutation, you first call `useCreateInviteToTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInviteToTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInviteToTeamMutation, { data, loading, error }] = useCreateInviteToTeamMutation({
 *   variables: {
 *      recipientId: // value for 'recipientId'
 *      teamId: // value for 'teamId'
 *      senderId: // value for 'senderId'
 *   },
 * });
 */
export function useCreateInviteToTeamMutation(baseOptions?: Apollo.MutationHookOptions<CreateInviteToTeamMutation, CreateInviteToTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInviteToTeamMutation, CreateInviteToTeamMutationVariables>(CreateInviteToTeamDocument, options);
      }
export type CreateInviteToTeamMutationHookResult = ReturnType<typeof useCreateInviteToTeamMutation>;
export type CreateInviteToTeamMutationResult = Apollo.MutationResult<CreateInviteToTeamMutation>;
export type CreateInviteToTeamMutationOptions = Apollo.BaseMutationOptions<CreateInviteToTeamMutation, CreateInviteToTeamMutationVariables>;
export const GetMatchesByParentIdsDocument = gql`
    query getMatchesByParentIds($parentIds: [Int!]!) {
  getMatchesByParentIds(parentIds: $parentIds) {
    id
    team1 {
      id
      name
      picture
    }
    team2 {
      id
      name
      picture
    }
  }
}
    `;

/**
 * __useGetMatchesByParentIdsQuery__
 *
 * To run a query within a React component, call `useGetMatchesByParentIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMatchesByParentIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMatchesByParentIdsQuery({
 *   variables: {
 *      parentIds: // value for 'parentIds'
 *   },
 * });
 */
export function useGetMatchesByParentIdsQuery(baseOptions: Apollo.QueryHookOptions<GetMatchesByParentIdsQuery, GetMatchesByParentIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMatchesByParentIdsQuery, GetMatchesByParentIdsQueryVariables>(GetMatchesByParentIdsDocument, options);
      }
export function useGetMatchesByParentIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMatchesByParentIdsQuery, GetMatchesByParentIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMatchesByParentIdsQuery, GetMatchesByParentIdsQueryVariables>(GetMatchesByParentIdsDocument, options);
        }
export type GetMatchesByParentIdsQueryHookResult = ReturnType<typeof useGetMatchesByParentIdsQuery>;
export type GetMatchesByParentIdsLazyQueryHookResult = ReturnType<typeof useGetMatchesByParentIdsLazyQuery>;
export type GetMatchesByParentIdsQueryResult = Apollo.QueryResult<GetMatchesByParentIdsQuery, GetMatchesByParentIdsQueryVariables>;
export const GetAllNotificationsDocument = gql`
    query getAllNotifications($userId: Int!) {
  getAllNotifications(userId: $userId) {
    id
    isSeen
    recipient {
      id
      playertag
      picture
    }
    notificationType
    notifiableObject {
      ... on InviteToTeam {
        id
        recipient {
          id
          playertag
          picture
        }
        sender {
          id
          playertag
          picture
        }
        createdTs
        team {
          id
          name
          picture
        }
        status
      }
    }
    createdTs
  }
}
    `;

/**
 * __useGetAllNotificationsQuery__
 *
 * To run a query within a React component, call `useGetAllNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllNotificationsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetAllNotificationsQuery(baseOptions: Apollo.QueryHookOptions<GetAllNotificationsQuery, GetAllNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllNotificationsQuery, GetAllNotificationsQueryVariables>(GetAllNotificationsDocument, options);
      }
export function useGetAllNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllNotificationsQuery, GetAllNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllNotificationsQuery, GetAllNotificationsQueryVariables>(GetAllNotificationsDocument, options);
        }
export type GetAllNotificationsQueryHookResult = ReturnType<typeof useGetAllNotificationsQuery>;
export type GetAllNotificationsLazyQueryHookResult = ReturnType<typeof useGetAllNotificationsLazyQuery>;
export type GetAllNotificationsQueryResult = Apollo.QueryResult<GetAllNotificationsQuery, GetAllNotificationsQueryVariables>;
export const MarkAllNotificationsAsSeenForUserDocument = gql`
    mutation markAllNotificationsAsSeenForUser($userId: Int!) {
  markAllNotificationsAsSeenForUser(userId: $userId) {
    id
    isSeen
  }
}
    `;
export type MarkAllNotificationsAsSeenForUserMutationFn = Apollo.MutationFunction<MarkAllNotificationsAsSeenForUserMutation, MarkAllNotificationsAsSeenForUserMutationVariables>;

/**
 * __useMarkAllNotificationsAsSeenForUserMutation__
 *
 * To run a mutation, you first call `useMarkAllNotificationsAsSeenForUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllNotificationsAsSeenForUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllNotificationsAsSeenForUserMutation, { data, loading, error }] = useMarkAllNotificationsAsSeenForUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useMarkAllNotificationsAsSeenForUserMutation(baseOptions?: Apollo.MutationHookOptions<MarkAllNotificationsAsSeenForUserMutation, MarkAllNotificationsAsSeenForUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAllNotificationsAsSeenForUserMutation, MarkAllNotificationsAsSeenForUserMutationVariables>(MarkAllNotificationsAsSeenForUserDocument, options);
      }
export type MarkAllNotificationsAsSeenForUserMutationHookResult = ReturnType<typeof useMarkAllNotificationsAsSeenForUserMutation>;
export type MarkAllNotificationsAsSeenForUserMutationResult = Apollo.MutationResult<MarkAllNotificationsAsSeenForUserMutation>;
export type MarkAllNotificationsAsSeenForUserMutationOptions = Apollo.BaseMutationOptions<MarkAllNotificationsAsSeenForUserMutation, MarkAllNotificationsAsSeenForUserMutationVariables>;
export const SetPictureAndGetPresignedRequestDocument = gql`
    mutation setPictureAndGetPresignedRequest($id: Int!, $objectType: ObjectType!) {
  setPictureAndGetPresignedRequest(id: $id, objectType: $objectType) {
    url
    headers {
      name
      value
    }
    method
  }
}
    `;
export type SetPictureAndGetPresignedRequestMutationFn = Apollo.MutationFunction<SetPictureAndGetPresignedRequestMutation, SetPictureAndGetPresignedRequestMutationVariables>;

/**
 * __useSetPictureAndGetPresignedRequestMutation__
 *
 * To run a mutation, you first call `useSetPictureAndGetPresignedRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetPictureAndGetPresignedRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setPictureAndGetPresignedRequestMutation, { data, loading, error }] = useSetPictureAndGetPresignedRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *      objectType: // value for 'objectType'
 *   },
 * });
 */
export function useSetPictureAndGetPresignedRequestMutation(baseOptions?: Apollo.MutationHookOptions<SetPictureAndGetPresignedRequestMutation, SetPictureAndGetPresignedRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetPictureAndGetPresignedRequestMutation, SetPictureAndGetPresignedRequestMutationVariables>(SetPictureAndGetPresignedRequestDocument, options);
      }
export type SetPictureAndGetPresignedRequestMutationHookResult = ReturnType<typeof useSetPictureAndGetPresignedRequestMutation>;
export type SetPictureAndGetPresignedRequestMutationResult = Apollo.MutationResult<SetPictureAndGetPresignedRequestMutation>;
export type SetPictureAndGetPresignedRequestMutationOptions = Apollo.BaseMutationOptions<SetPictureAndGetPresignedRequestMutation, SetPictureAndGetPresignedRequestMutationVariables>;
export const RegisterTeamDocument = gql`
    mutation registerTeam($tournamentId: Int!, $teamId: Int!) {
  registerTeam(teamId: $teamId, tournamentId: $tournamentId) {
    id
    teamRegistrations {
      id
      team {
        id
        name
      }
    }
  }
}
    `;
export type RegisterTeamMutationFn = Apollo.MutationFunction<RegisterTeamMutation, RegisterTeamMutationVariables>;

/**
 * __useRegisterTeamMutation__
 *
 * To run a mutation, you first call `useRegisterTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerTeamMutation, { data, loading, error }] = useRegisterTeamMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useRegisterTeamMutation(baseOptions?: Apollo.MutationHookOptions<RegisterTeamMutation, RegisterTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterTeamMutation, RegisterTeamMutationVariables>(RegisterTeamDocument, options);
      }
export type RegisterTeamMutationHookResult = ReturnType<typeof useRegisterTeamMutation>;
export type RegisterTeamMutationResult = Apollo.MutationResult<RegisterTeamMutation>;
export type RegisterTeamMutationOptions = Apollo.BaseMutationOptions<RegisterTeamMutation, RegisterTeamMutationVariables>;
export const GetAllTeamsDocument = gql`
    query getAllTeams {
  getAllTeams {
    id
    name
    picture
    wins
    losses
    createdTs
  }
}
    `;

/**
 * __useGetAllTeamsQuery__
 *
 * To run a query within a React component, call `useGetAllTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTeamsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTeamsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllTeamsQuery, GetAllTeamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllTeamsQuery, GetAllTeamsQueryVariables>(GetAllTeamsDocument, options);
      }
export function useGetAllTeamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTeamsQuery, GetAllTeamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllTeamsQuery, GetAllTeamsQueryVariables>(GetAllTeamsDocument, options);
        }
export type GetAllTeamsQueryHookResult = ReturnType<typeof useGetAllTeamsQuery>;
export type GetAllTeamsLazyQueryHookResult = ReturnType<typeof useGetAllTeamsLazyQuery>;
export type GetAllTeamsQueryResult = Apollo.QueryResult<GetAllTeamsQuery, GetAllTeamsQueryVariables>;
export const GetTeamByIdDocument = gql`
    query getTeamById($teamId: Int!) {
  getTeamById(teamId: $teamId) {
    id
    name
    owner {
      id
      playertag
      picture
    }
    picture
    wins
    losses
    createdTs
    users {
      id
      playertag
      picture
    }
  }
}
    `;

/**
 * __useGetTeamByIdQuery__
 *
 * To run a query within a React component, call `useGetTeamByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamByIdQuery({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useGetTeamByIdQuery(baseOptions: Apollo.QueryHookOptions<GetTeamByIdQuery, GetTeamByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamByIdQuery, GetTeamByIdQueryVariables>(GetTeamByIdDocument, options);
      }
export function useGetTeamByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamByIdQuery, GetTeamByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamByIdQuery, GetTeamByIdQueryVariables>(GetTeamByIdDocument, options);
        }
export type GetTeamByIdQueryHookResult = ReturnType<typeof useGetTeamByIdQuery>;
export type GetTeamByIdLazyQueryHookResult = ReturnType<typeof useGetTeamByIdLazyQuery>;
export type GetTeamByIdQueryResult = Apollo.QueryResult<GetTeamByIdQuery, GetTeamByIdQueryVariables>;
export const IncrementWinsDocument = gql`
    mutation incrementWins($teamId: Int!) {
  incrementWins(teamId: $teamId) {
    id
    wins
  }
}
    `;
export type IncrementWinsMutationFn = Apollo.MutationFunction<IncrementWinsMutation, IncrementWinsMutationVariables>;

/**
 * __useIncrementWinsMutation__
 *
 * To run a mutation, you first call `useIncrementWinsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIncrementWinsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [incrementWinsMutation, { data, loading, error }] = useIncrementWinsMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useIncrementWinsMutation(baseOptions?: Apollo.MutationHookOptions<IncrementWinsMutation, IncrementWinsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<IncrementWinsMutation, IncrementWinsMutationVariables>(IncrementWinsDocument, options);
      }
export type IncrementWinsMutationHookResult = ReturnType<typeof useIncrementWinsMutation>;
export type IncrementWinsMutationResult = Apollo.MutationResult<IncrementWinsMutation>;
export type IncrementWinsMutationOptions = Apollo.BaseMutationOptions<IncrementWinsMutation, IncrementWinsMutationVariables>;
export const IncrementLossesDocument = gql`
    mutation incrementLosses($teamId: Int!) {
  incrementLosses(teamId: $teamId) {
    id
    losses
  }
}
    `;
export type IncrementLossesMutationFn = Apollo.MutationFunction<IncrementLossesMutation, IncrementLossesMutationVariables>;

/**
 * __useIncrementLossesMutation__
 *
 * To run a mutation, you first call `useIncrementLossesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIncrementLossesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [incrementLossesMutation, { data, loading, error }] = useIncrementLossesMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useIncrementLossesMutation(baseOptions?: Apollo.MutationHookOptions<IncrementLossesMutation, IncrementLossesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<IncrementLossesMutation, IncrementLossesMutationVariables>(IncrementLossesDocument, options);
      }
export type IncrementLossesMutationHookResult = ReturnType<typeof useIncrementLossesMutation>;
export type IncrementLossesMutationResult = Apollo.MutationResult<IncrementLossesMutation>;
export type IncrementLossesMutationOptions = Apollo.BaseMutationOptions<IncrementLossesMutation, IncrementLossesMutationVariables>;
export const CreateTeamDocument = gql`
    mutation createTeam($name: String!, $ownerId: Int!) {
  createTeam(name: $name, ownerId: $ownerId) {
    id
    users {
      id
      playertag
      picture
    }
  }
}
    `;
export type CreateTeamMutationFn = Apollo.MutationFunction<CreateTeamMutation, CreateTeamMutationVariables>;

/**
 * __useCreateTeamMutation__
 *
 * To run a mutation, you first call `useCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMutation, { data, loading, error }] = useCreateTeamMutation({
 *   variables: {
 *      name: // value for 'name'
 *      ownerId: // value for 'ownerId'
 *   },
 * });
 */
export function useCreateTeamMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamMutation, CreateTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(CreateTeamDocument, options);
      }
export type CreateTeamMutationHookResult = ReturnType<typeof useCreateTeamMutation>;
export type CreateTeamMutationResult = Apollo.MutationResult<CreateTeamMutation>;
export type CreateTeamMutationOptions = Apollo.BaseMutationOptions<CreateTeamMutation, CreateTeamMutationVariables>;
export const CreateTournamentDocument = gql`
    mutation createTournament($name: String!, $date: LocalDateTime!, $format: TournamentFormat!, $numberOfTeamsAllowed: Int!, $picture: String, $description: String!, $rules: String!) {
  createTournament(
    name: $name
    date: $date
    numberOfTeamsAllowed: $numberOfTeamsAllowed
    format: $format
    picture: $picture
    description: $description
    rules: $rules
  ) {
    id
    name
    picture
    description
    format
    rules
    bracket {
      id
      root {
        id
        left {
          id
        }
        right {
          id
        }
      }
    }
    startDateAndTime
    numberOfTeamsAllowed
  }
}
    `;
export type CreateTournamentMutationFn = Apollo.MutationFunction<CreateTournamentMutation, CreateTournamentMutationVariables>;

/**
 * __useCreateTournamentMutation__
 *
 * To run a mutation, you first call `useCreateTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTournamentMutation, { data, loading, error }] = useCreateTournamentMutation({
 *   variables: {
 *      name: // value for 'name'
 *      date: // value for 'date'
 *      format: // value for 'format'
 *      numberOfTeamsAllowed: // value for 'numberOfTeamsAllowed'
 *      picture: // value for 'picture'
 *      description: // value for 'description'
 *      rules: // value for 'rules'
 *   },
 * });
 */
export function useCreateTournamentMutation(baseOptions?: Apollo.MutationHookOptions<CreateTournamentMutation, CreateTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTournamentMutation, CreateTournamentMutationVariables>(CreateTournamentDocument, options);
      }
export type CreateTournamentMutationHookResult = ReturnType<typeof useCreateTournamentMutation>;
export type CreateTournamentMutationResult = Apollo.MutationResult<CreateTournamentMutation>;
export type CreateTournamentMutationOptions = Apollo.BaseMutationOptions<CreateTournamentMutation, CreateTournamentMutationVariables>;
export const GetAllTournamentsDocument = gql`
    query getAllTournaments {
  getAllTournaments {
    id
    name
    picture
    description
    format
    bracket {
      id
      root {
        id
        left {
          id
        }
        right {
          id
        }
      }
    }
    startDateAndTime
    numberOfTeamsAllowed
    teamRegistrations {
      team {
        id
      }
      id
    }
    createdTs
    status
    published
  }
}
    `;

/**
 * __useGetAllTournamentsQuery__
 *
 * To run a query within a React component, call `useGetAllTournamentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTournamentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTournamentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTournamentsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllTournamentsQuery, GetAllTournamentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllTournamentsQuery, GetAllTournamentsQueryVariables>(GetAllTournamentsDocument, options);
      }
export function useGetAllTournamentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTournamentsQuery, GetAllTournamentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllTournamentsQuery, GetAllTournamentsQueryVariables>(GetAllTournamentsDocument, options);
        }
export type GetAllTournamentsQueryHookResult = ReturnType<typeof useGetAllTournamentsQuery>;
export type GetAllTournamentsLazyQueryHookResult = ReturnType<typeof useGetAllTournamentsLazyQuery>;
export type GetAllTournamentsQueryResult = Apollo.QueryResult<GetAllTournamentsQuery, GetAllTournamentsQueryVariables>;
export const GenerateBracketDocument = gql`
    mutation generateBracket($tournamentId: Int!) {
  generateBracket(tournamentId: $tournamentId) {
    id
    bracket {
      id
      root {
        id
        left {
          id
        }
        right {
          id
        }
        parent {
          id
        }
        team1 {
          id
          name
        }
        team2 {
          id
          name
        }
        result
      }
    }
  }
}
    `;
export type GenerateBracketMutationFn = Apollo.MutationFunction<GenerateBracketMutation, GenerateBracketMutationVariables>;

/**
 * __useGenerateBracketMutation__
 *
 * To run a mutation, you first call `useGenerateBracketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateBracketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateBracketMutation, { data, loading, error }] = useGenerateBracketMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useGenerateBracketMutation(baseOptions?: Apollo.MutationHookOptions<GenerateBracketMutation, GenerateBracketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateBracketMutation, GenerateBracketMutationVariables>(GenerateBracketDocument, options);
      }
export type GenerateBracketMutationHookResult = ReturnType<typeof useGenerateBracketMutation>;
export type GenerateBracketMutationResult = Apollo.MutationResult<GenerateBracketMutation>;
export type GenerateBracketMutationOptions = Apollo.BaseMutationOptions<GenerateBracketMutation, GenerateBracketMutationVariables>;
export const GetTournamentByIdDocument = gql`
    query getTournamentById($id: Int!) {
  getTournamentById(id: $id) {
    id
    name
    picture
    description
    format
    startDateAndTime
    numberOfTeamsAllowed
    teamRegistrations {
      id
      team {
        id
        name
        picture
        users {
          id
          picture
          playertag
        }
      }
      createdTs
    }
    bracket {
      id
      root {
        id
        team1 {
          id
          name
          picture
        }
        team2 {
          id
          name
          picture
        }
      }
    }
  }
}
    `;

/**
 * __useGetTournamentByIdQuery__
 *
 * To run a query within a React component, call `useGetTournamentByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTournamentByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTournamentByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTournamentByIdQuery(baseOptions: Apollo.QueryHookOptions<GetTournamentByIdQuery, GetTournamentByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTournamentByIdQuery, GetTournamentByIdQueryVariables>(GetTournamentByIdDocument, options);
      }
export function useGetTournamentByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTournamentByIdQuery, GetTournamentByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTournamentByIdQuery, GetTournamentByIdQueryVariables>(GetTournamentByIdDocument, options);
        }
export type GetTournamentByIdQueryHookResult = ReturnType<typeof useGetTournamentByIdQuery>;
export type GetTournamentByIdLazyQueryHookResult = ReturnType<typeof useGetTournamentByIdLazyQuery>;
export type GetTournamentByIdQueryResult = Apollo.QueryResult<GetTournamentByIdQuery, GetTournamentByIdQueryVariables>;
export const GetUserByIdDocument = gql`
    query getUserById($id: Int!) {
  getUserById(id: $id) {
    id
    playertag
    email
    role
    picture
    teams {
      name
      users {
        playertag
      }
    }
  }
}
    `;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
      }
export function useGetUserByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<typeof useGetUserByIdLazyQuery>;
export type GetUserByIdQueryResult = Apollo.QueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetCurrentUserDocument = gql`
    query getCurrentUser($token: String!) {
  getCurrentUser(token: $token) {
    id
    playertag
    email
    role
    picture
    teams {
      id
      name
      picture
      users {
        playertag
      }
    }
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const CreateUserDocument = gql`
    mutation createUser($playertag: String!, $email: String!, $password: String!) {
  createUser(playertag: $playertag, email: $email, password: $password)
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      playertag: // value for 'playertag'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const LoginUserDocument = gql`
    mutation loginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password)
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const ListAllOperations = {
  Query: {
    findAllInvitesForPlayer: 'findAllInvitesForPlayer',
    findPendingInvitesForPlayer: 'findPendingInvitesForPlayer',
    getMatchesByParentIds: 'getMatchesByParentIds',
    getAllNotifications: 'getAllNotifications',
    getAllTeams: 'getAllTeams',
    getTeamById: 'getTeamById',
    getAllTournaments: 'getAllTournaments',
    getTournamentById: 'getTournamentById',
    getUserById: 'getUserById',
    getCurrentUser: 'getCurrentUser'
  },
  Mutation: {
    acceptInvitation: 'acceptInvitation',
    declineInvitation: 'declineInvitation',
    createInviteToTeam: 'createInviteToTeam',
    markAllNotificationsAsSeenForUser: 'markAllNotificationsAsSeenForUser',
    setPictureAndGetPresignedRequest: 'setPictureAndGetPresignedRequest',
    registerTeam: 'registerTeam',
    incrementWins: 'incrementWins',
    incrementLosses: 'incrementLosses',
    createTeam: 'createTeam',
    createTournament: 'createTournament',
    generateBracket: 'generateBracket',
    createUser: 'createUser',
    loginUser: 'loginUser'
  },
  Fragment: {
    NewNotification: 'NewNotification'
  }
}