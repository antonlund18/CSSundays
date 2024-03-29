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

export enum CsMap {
  Ancient = 'ANCIENT',
  Anubis = 'ANUBIS',
  Inferno = 'INFERNO',
  Mirage = 'MIRAGE',
  Nuke = 'NUKE',
  Overpass = 'OVERPASS',
  Vertigo = 'VERTIGO'
}

export enum ChangeMatchPhaseStrategy {
  Cancelled = 'CANCELLED',
  FinishedWinTeam_1 = 'FINISHED_WIN_TEAM_1',
  FinishedWinTeam_2 = 'FINISHED_WIN_TEAM_2',
  InProgress = 'IN_PROGRESS',
  PickAndBanBo1 = 'PICK_AND_BAN_BO1',
  PickAndBanTimeout = 'PICK_AND_BAN_TIMEOUT',
  ReadyCheckOneCaptainPerTeam = 'READY_CHECK_ONE_CAPTAIN_PER_TEAM',
  ReadyCheckTimeOut = 'READY_CHECK_TIME_OUT',
  WaitingForTeams = 'WAITING_FOR_TEAMS',
  WaitingToStart = 'WAITING_TO_START'
}

export type EditUserInput = {
  description: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Int'];
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
  allPhases: Array<MatchPhase>;
  chatMessages: Array<MatchChatMessage>;
  createdTs: Scalars['LocalDateTime'];
  currentPhase: MatchPhase;
  id?: Maybe<Scalars['Int']>;
  left?: Maybe<Match>;
  parent?: Maybe<Match>;
  right?: Maybe<Match>;
  tournamentRegistration1?: Maybe<TournamentRegistration>;
  tournamentRegistration2?: Maybe<TournamentRegistration>;
};

export type MatchChatMessage = {
  __typename?: 'MatchChatMessage';
  createdTs: Scalars['LocalDateTime'];
  id?: Maybe<Scalars['Int']>;
  match: Match;
  message: Scalars['String'];
  sender: User;
};

export type MatchFinishedPhaseState = MatchPhaseState & {
  __typename?: 'MatchFinishedPhaseState';
  id: Scalars['Int'];
  winTeamOne: Scalars['Boolean'];
};

export type MatchInProgressPhaseState = MatchPhaseState & {
  __typename?: 'MatchInProgressPhaseState';
  id: Scalars['Int'];
  map?: Maybe<CsMap>;
};

export type MatchPhase = {
  __typename?: 'MatchPhase';
  createdTs: Scalars['LocalDateTime'];
  endTs?: Maybe<Scalars['LocalDateTime']>;
  id: Scalars['Int'];
  match?: Maybe<Match>;
  phaseType: MatchPhaseType;
  state?: Maybe<MatchPhaseState>;
};

export type MatchPhaseState = {
  id: Scalars['Int'];
};

export enum MatchPhaseType {
  Cancelled = 'CANCELLED',
  Finished = 'FINISHED',
  Initializing = 'INITIALIZING',
  InProgress = 'IN_PROGRESS',
  PickAndBan = 'PICK_AND_BAN',
  ReadyCheck = 'READY_CHECK',
  WaitingForTeams = 'WAITING_FOR_TEAMS',
  WaitingToStart = 'WAITING_TO_START'
}

export type MatchPickAndBanPhaseAction = {
  __typename?: 'MatchPickAndBanPhaseAction';
  ban: CsMap;
  captain: User;
  createdTs: Scalars['LocalDateTime'];
  id?: Maybe<Scalars['Int']>;
  state: MatchPickAndBanPhaseState;
};

export type MatchPickAndBanPhaseState = MatchPhaseState & {
  __typename?: 'MatchPickAndBanPhaseState';
  actions: Array<MatchPickAndBanPhaseAction>;
  firstTeamToBan: Scalars['Int'];
  id: Scalars['Int'];
  votingTimeInSeconds: Scalars['Int'];
};

export type MatchReadyCheckPhaseCaptainPerTeamAction = {
  __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction';
  captain: User;
  id?: Maybe<Scalars['Int']>;
  ready: Scalars['Boolean'];
};

export type MatchReadyCheckPhaseState = MatchPhaseState & {
  __typename?: 'MatchReadyCheckPhaseState';
  id: Scalars['Int'];
  teamOneAction: MatchReadyCheckPhaseCaptainPerTeamAction;
  teamTwoAction: MatchReadyCheckPhaseCaptainPerTeamAction;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation?: Maybe<InviteToTeam>;
  banMap?: Maybe<Match>;
  changeMatchPhase?: Maybe<Match>;
  changePassword?: Maybe<User>;
  createInviteToTeam?: Maybe<InviteToTeam>;
  createNotification?: Maybe<Notification>;
  createTeam?: Maybe<Team>;
  createTestData?: Maybe<Tournament>;
  createTestMatch?: Maybe<Match>;
  createTournament?: Maybe<Tournament>;
  createUser?: Maybe<Scalars['String']>;
  declineInvitation?: Maybe<InviteToTeam>;
  deletePicture?: Maybe<User>;
  deregisterPlayerFromTournament?: Maybe<Tournament>;
  deregisterTeamFromTournament?: Maybe<Tournament>;
  generateBracket?: Maybe<Tournament>;
  handleMatchFinished?: Maybe<Match>;
  incrementLosses?: Maybe<Team>;
  incrementWins?: Maybe<Team>;
  loginUser?: Maybe<Scalars['String']>;
  markAllNotificationsAsSeenForUser: Array<Notification>;
  markReady?: Maybe<Match>;
  publishTournament?: Maybe<Tournament>;
  registerTeamOrPlayer?: Maybe<Tournament>;
  removePublicationFromTournament?: Maybe<Tournament>;
  sendChatMessage?: Maybe<MatchChatMessage>;
  setPictureAndGetPresignedRequest?: Maybe<RequestDto>;
  setSteamId?: Maybe<User>;
  startTournament?: Maybe<Tournament>;
  updateUser?: Maybe<User>;
};


export type MutationAcceptInvitationArgs = {
  invitationId: Scalars['Int'];
};


export type MutationBanMapArgs = {
  ban: CsMap;
  matchId: Scalars['Int'];
  playerId: Scalars['Int'];
};


export type MutationChangeMatchPhaseArgs = {
  changeMatchPhaseStrategy: ChangeMatchPhaseStrategy;
  matchId: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
  newPasswordRepeated: Scalars['String'];
  userId: Scalars['Int'];
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
  passwordRepeated: Scalars['String'];
  playertag: Scalars['String'];
};


export type MutationDeclineInvitationArgs = {
  invitationId: Scalars['Int'];
};


export type MutationDeletePictureArgs = {
  userId: Scalars['Int'];
};


export type MutationDeregisterPlayerFromTournamentArgs = {
  playerId: Scalars['Int'];
  tournamentId: Scalars['Int'];
};


export type MutationDeregisterTeamFromTournamentArgs = {
  teamId: Scalars['Int'];
  tournamentId: Scalars['Int'];
};


export type MutationGenerateBracketArgs = {
  tournamentId: Scalars['Int'];
};


export type MutationHandleMatchFinishedArgs = {
  matchId: Scalars['Int'];
  winningTeamId: Scalars['Int'];
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


export type MutationMarkReadyArgs = {
  matchId: Scalars['Int'];
  playerId: Scalars['Int'];
};


export type MutationPublishTournamentArgs = {
  tournamentId: Scalars['Int'];
};


export type MutationRegisterTeamOrPlayerArgs = {
  playerId: Scalars['Int'];
  teamId: Scalars['Int'];
  tournamentId: Scalars['Int'];
};


export type MutationRemovePublicationFromTournamentArgs = {
  tournamentId: Scalars['Int'];
};


export type MutationSendChatMessageArgs = {
  matchId: Scalars['Int'];
  message: Scalars['String'];
  senderId: Scalars['Int'];
};


export type MutationSetPictureAndGetPresignedRequestArgs = {
  id: Scalars['Int'];
  objectType: ObjectType;
};


export type MutationSetSteamIdArgs = {
  steamId: Scalars['String'];
  userId: Scalars['Int'];
};


export type MutationStartTournamentArgs = {
  tournamentId: Scalars['Int'];
};


export type MutationUpdateUserArgs = {
  editUserInput: EditUserInput;
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
  getMatchById?: Maybe<Match>;
  getMatchesByParentIds: Array<Match>;
  getSearchResults: Array<Searchable>;
  getTeamById?: Maybe<Team>;
  getTournamentById?: Maybe<Tournament>;
  getTournamentRegistrationByPlayer?: Maybe<TournamentRegistration>;
  getTournamentRegistrationByTeam?: Maybe<TournamentRegistration>;
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


export type QueryGetMatchByIdArgs = {
  matchId: Scalars['Int'];
};


export type QueryGetMatchesByParentIdsArgs = {
  parentIds: Array<Scalars['Int']>;
};


export type QueryGetSearchResultsArgs = {
  searchQuery: Scalars['String'];
  searchType: SearchType;
};


export type QueryGetTeamByIdArgs = {
  teamId: Scalars['Int'];
};


export type QueryGetTournamentByIdArgs = {
  id: Scalars['Int'];
};


export type QueryGetTournamentRegistrationByPlayerArgs = {
  playerId: Scalars['Int'];
  tournamentId: Scalars['Int'];
};


export type QueryGetTournamentRegistrationByTeamArgs = {
  teamId: Scalars['Int'];
  tournamentId: Scalars['Int'];
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

export enum SearchType {
  All = 'ALL',
  Players = 'PLAYERS',
  Teams = 'TEAMS',
  Tournaments = 'TOURNAMENTS'
}

export type Searchable = Team | Tournament | User;

export type Subscription = {
  __typename?: 'Subscription';
  onMatchPhaseChanged: MatchPhase;
  onNewMatchChatMessage: MatchChatMessage;
  onNewNotification: Notification;
};


export type SubscriptionOnMatchPhaseChangedArgs = {
  matchId: Scalars['Int'];
};


export type SubscriptionOnNewMatchChatMessageArgs = {
  matchId: Scalars['Int'];
};


export type SubscriptionOnNewNotificationArgs = {
  userId?: InputMaybe<Scalars['Int']>;
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
  tournamentRegistrations: Array<TournamentRegistration>;
};

export enum TournamentFormat {
  SingleElimination = 'SINGLE_ELIMINATION'
}

export type TournamentRegistration = {
  __typename?: 'TournamentRegistration';
  captain: User;
  createdTs: Scalars['LocalDateTime'];
  id?: Maybe<Scalars['Int']>;
  players: Array<User>;
  team: Team;
  tournament?: Maybe<Tournament>;
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
  description: Scalars['String'];
  email: Scalars['String'];
  id?: Maybe<Scalars['Int']>;
  password: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  playertag: Scalars['String'];
  role: UserRole;
  slug: Scalars['String'];
  steamId?: Maybe<Scalars['String']>;
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


export type CreateInviteToTeamMutation = { __typename?: 'Mutation', createInviteToTeam?: { __typename?: 'InviteToTeam', id?: number, status: InviteToTeamStatus, recipient: { __typename?: 'User', id?: number } } };

export type GetMatchesByParentIdsQueryVariables = Exact<{
  parentIds: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type GetMatchesByParentIdsQuery = { __typename?: 'Query', getMatchesByParentIds: Array<{ __typename?: 'Match', id?: number, tournamentRegistration1?: { __typename?: 'TournamentRegistration', team: { __typename?: 'Team', id?: number, name: string, picture?: string }, players: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> }, tournamentRegistration2?: { __typename?: 'TournamentRegistration', team: { __typename?: 'Team', id?: number, name: string, picture?: string }, players: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> }, currentPhase: { __typename?: 'MatchPhase', id: number, phaseType: MatchPhaseType, createdTs: any, endTs?: any, match?: { __typename?: 'Match', id?: number }, state?: { __typename: 'MatchFinishedPhaseState', id: number, winTeamOne: boolean } | { __typename: 'MatchInProgressPhaseState', id: number, map?: CsMap } | { __typename: 'MatchPickAndBanPhaseState', id: number, firstTeamToBan: number, votingTimeInSeconds: number, actions: Array<{ __typename?: 'MatchPickAndBanPhaseAction', id?: number, ban: CsMap, captain: { __typename?: 'User', id?: number } }> } | { __typename: 'MatchReadyCheckPhaseState', id: number, teamOneAction: { __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction', ready: boolean }, teamTwoAction: { __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction', ready: boolean } } } }> };

export type GetMatchByIdQueryVariables = Exact<{
  matchId: Scalars['Int'];
}>;


export type GetMatchByIdQuery = { __typename?: 'Query', getMatchById?: { __typename?: 'Match', id?: number, tournamentRegistration1?: { __typename?: 'TournamentRegistration', team: { __typename?: 'Team', id?: number, name: string, picture?: string }, players: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }>, captain: { __typename?: 'User', id?: number, playertag: string, picture?: string } }, tournamentRegistration2?: { __typename?: 'TournamentRegistration', team: { __typename?: 'Team', id?: number, name: string, picture?: string }, players: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }>, captain: { __typename?: 'User', id?: number, playertag: string, picture?: string } }, chatMessages: Array<{ __typename?: 'MatchChatMessage', message: string, createdTs: any, sender: { __typename?: 'User', id?: number, playertag: string } }>, currentPhase: { __typename?: 'MatchPhase', id: number, phaseType: MatchPhaseType, createdTs: any, endTs?: any, match?: { __typename?: 'Match', id?: number }, state?: { __typename: 'MatchFinishedPhaseState', id: number, winTeamOne: boolean } | { __typename: 'MatchInProgressPhaseState', id: number, map?: CsMap } | { __typename: 'MatchPickAndBanPhaseState', id: number, firstTeamToBan: number, votingTimeInSeconds: number, actions: Array<{ __typename?: 'MatchPickAndBanPhaseAction', id?: number, ban: CsMap, captain: { __typename?: 'User', id?: number } }> } | { __typename: 'MatchReadyCheckPhaseState', id: number, teamOneAction: { __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction', ready: boolean }, teamTwoAction: { __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction', ready: boolean } } } } };

export type MarkReadyMutationVariables = Exact<{
  matchId: Scalars['Int'];
  playerId: Scalars['Int'];
}>;


export type MarkReadyMutation = { __typename?: 'Mutation', markReady?: { __typename?: 'Match', id?: number, currentPhase: { __typename?: 'MatchPhase', id: number, phaseType: MatchPhaseType, createdTs: any, endTs?: any, state?: { __typename: 'MatchFinishedPhaseState' } | { __typename: 'MatchInProgressPhaseState' } | { __typename: 'MatchPickAndBanPhaseState', id: number, firstTeamToBan: number, votingTimeInSeconds: number, actions: Array<{ __typename?: 'MatchPickAndBanPhaseAction', id?: number, ban: CsMap, captain: { __typename?: 'User', id?: number } }> } | { __typename: 'MatchReadyCheckPhaseState', id: number, teamOneAction: { __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction', ready: boolean }, teamTwoAction: { __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction', ready: boolean } } } } };

export type BanMapMutationVariables = Exact<{
  matchId: Scalars['Int'];
  playerId: Scalars['Int'];
  ban: CsMap;
}>;


export type BanMapMutation = { __typename?: 'Mutation', banMap?: { __typename?: 'Match', id?: number, currentPhase: { __typename?: 'MatchPhase', id: number, endTs?: any, state?: { __typename: 'MatchFinishedPhaseState', id: number, winTeamOne: boolean } | { __typename: 'MatchInProgressPhaseState', id: number, map?: CsMap } | { __typename: 'MatchPickAndBanPhaseState', id: number, firstTeamToBan: number, votingTimeInSeconds: number, actions: Array<{ __typename?: 'MatchPickAndBanPhaseAction', id?: number, ban: CsMap, captain: { __typename?: 'User', id?: number } }> } | { __typename: 'MatchReadyCheckPhaseState' } } } };

export type SendChatMessageMutationVariables = Exact<{
  matchId: Scalars['Int'];
  senderId: Scalars['Int'];
  message: Scalars['String'];
}>;


export type SendChatMessageMutation = { __typename?: 'Mutation', sendChatMessage?: { __typename?: 'MatchChatMessage', id?: number, message: string, createdTs: any, match: { __typename?: 'Match', id?: number }, sender: { __typename?: 'User', id?: number, playertag: string } } };

export type OnMatchPhaseChangedSubscriptionVariables = Exact<{
  matchId: Scalars['Int'];
}>;


export type OnMatchPhaseChangedSubscription = { __typename?: 'Subscription', onMatchPhaseChanged: { __typename?: 'MatchPhase', id: number, phaseType: MatchPhaseType, createdTs: any, endTs?: any, match?: { __typename?: 'Match', id?: number }, state?: { __typename: 'MatchFinishedPhaseState', id: number, winTeamOne: boolean } | { __typename: 'MatchInProgressPhaseState', id: number, map?: CsMap } | { __typename: 'MatchPickAndBanPhaseState', id: number, firstTeamToBan: number, votingTimeInSeconds: number, actions: Array<{ __typename?: 'MatchPickAndBanPhaseAction', id?: number, ban: CsMap, captain: { __typename?: 'User', id?: number } }> } | { __typename: 'MatchReadyCheckPhaseState', id: number, teamOneAction: { __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction', ready: boolean }, teamTwoAction: { __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction', ready: boolean } } } };

export type OnNewMatchChatMessageSubscriptionVariables = Exact<{
  matchId: Scalars['Int'];
}>;


export type OnNewMatchChatMessageSubscription = { __typename?: 'Subscription', onNewMatchChatMessage: { __typename?: 'MatchChatMessage', id?: number, message: string, createdTs: any, sender: { __typename?: 'User', id?: number, playertag: string } } };

export type GetAllNotificationsQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type GetAllNotificationsQuery = { __typename?: 'Query', getAllNotifications: Array<{ __typename?: 'Notification', id?: number, isSeen: boolean, notificationType: NotificationType, createdTs: any, recipient: { __typename?: 'User', id?: number, playertag: string, picture?: string }, notifiableObject?: { __typename?: 'InviteToTeam', id?: number, createdTs: any, status: InviteToTeamStatus, recipient: { __typename?: 'User', id?: number, playertag: string, picture?: string }, sender: { __typename?: 'User', id?: number, playertag: string, picture?: string }, team: { __typename?: 'Team', id?: number, name: string, picture?: string } } }> };

export type MarkAllNotificationsAsSeenForUserMutationVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type MarkAllNotificationsAsSeenForUserMutation = { __typename?: 'Mutation', markAllNotificationsAsSeenForUser: Array<{ __typename?: 'Notification', id?: number, isSeen: boolean }> };

export type OnNewNotificationSubscriptionVariables = Exact<{
  userId?: InputMaybe<Scalars['Int']>;
}>;


export type OnNewNotificationSubscription = { __typename?: 'Subscription', onNewNotification: { __typename?: 'Notification', id?: number, isSeen: boolean, notificationType: NotificationType, createdTs: any, recipient: { __typename?: 'User', id?: number, playertag: string, picture?: string }, notifiableObject?: { __typename?: 'InviteToTeam', id?: number, createdTs: any, status: InviteToTeamStatus, recipient: { __typename?: 'User', id?: number, playertag: string, picture?: string }, sender: { __typename?: 'User', id?: number, playertag: string, picture?: string }, team: { __typename?: 'Team', id?: number, name: string, picture?: string } } } };

export type GetSearchResultsQueryVariables = Exact<{
  searchQuery: Scalars['String'];
  searchType: SearchType;
}>;


export type GetSearchResultsQuery = { __typename?: 'Query', getSearchResults: Array<{ __typename?: 'Team', id?: number, name: string, picture?: string, createdTs: any, owner: { __typename?: 'User', playertag: string }, users: Array<{ __typename?: 'User', id?: number }> } | { __typename?: 'Tournament', id?: number, name: string, picture?: string, startDateAndTime: any, tournamentRegistrations: Array<{ __typename?: 'TournamentRegistration', id?: number }> } | { __typename?: 'User', id?: number, playertag: string, picture?: string, createdTs: any }> };

export type SetPictureAndGetPresignedRequestMutationVariables = Exact<{
  id: Scalars['Int'];
  objectType: ObjectType;
}>;


export type SetPictureAndGetPresignedRequestMutation = { __typename?: 'Mutation', setPictureAndGetPresignedRequest?: { __typename?: 'RequestDTO', url: string, method: string, headers: Array<{ __typename?: 'HeaderDTO', name: string, value: string }> } };

export type RegisterTeamOrPlayerMutationVariables = Exact<{
  tournamentId: Scalars['Int'];
  teamId: Scalars['Int'];
  playerId: Scalars['Int'];
}>;


export type RegisterTeamOrPlayerMutation = { __typename?: 'Mutation', registerTeamOrPlayer?: { __typename?: 'Tournament', id?: number, tournamentRegistrations: Array<{ __typename?: 'TournamentRegistration', id?: number, captain: { __typename?: 'User', id?: number, playertag: string, picture?: string }, team: { __typename?: 'Team', id?: number, name: string } }> } };

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


export type GetAllTournamentsQuery = { __typename?: 'Query', getAllTournaments: Array<{ __typename?: 'Tournament', id?: number, name: string, picture?: string, description: string, format: TournamentFormat, rules: string, startDateAndTime: any, numberOfTeamsAllowed: number, createdTs: any, status: TournamentStatus, published: boolean, bracket?: { __typename?: 'Bracket', id?: number, root?: { __typename?: 'Match', id?: number, left?: { __typename?: 'Match', id?: number }, right?: { __typename?: 'Match', id?: number } } }, tournamentRegistrations: Array<{ __typename?: 'TournamentRegistration', id?: number, team: { __typename?: 'Team', id?: number } }> }> };

export type GenerateBracketMutationVariables = Exact<{
  tournamentId: Scalars['Int'];
}>;


export type GenerateBracketMutation = { __typename?: 'Mutation', generateBracket?: { __typename?: 'Tournament', id?: number, bracket?: { __typename?: 'Bracket', id?: number, root?: { __typename?: 'Match', id?: number, left?: { __typename?: 'Match', id?: number }, right?: { __typename?: 'Match', id?: number }, parent?: { __typename?: 'Match', id?: number }, tournamentRegistration1?: { __typename?: 'TournamentRegistration', team: { __typename?: 'Team', id?: number, name: string } }, tournamentRegistration2?: { __typename?: 'TournamentRegistration', team: { __typename?: 'Team', id?: number, name: string } } } } } };

export type GetTournamentByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetTournamentByIdQuery = { __typename?: 'Query', getTournamentById?: { __typename?: 'Tournament', id?: number, name: string, picture?: string, description: string, format: TournamentFormat, rules: string, startDateAndTime: any, numberOfTeamsAllowed: number, tournamentRegistrations: Array<{ __typename?: 'TournamentRegistration', id?: number, createdTs: any, captain: { __typename?: 'User', id?: number, playertag: string, picture?: string }, team: { __typename?: 'Team', id?: number, name: string, picture?: string }, players: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> }>, bracket?: { __typename?: 'Bracket', id?: number, root?: { __typename?: 'Match', id?: number, tournamentRegistration1?: { __typename?: 'TournamentRegistration', team: { __typename?: 'Team', id?: number, name: string, picture?: string }, players: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> }, tournamentRegistration2?: { __typename?: 'TournamentRegistration', team: { __typename?: 'Team', id?: number, name: string, picture?: string }, players: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> }, currentPhase: { __typename?: 'MatchPhase', id: number, phaseType: MatchPhaseType, createdTs: any, endTs?: any, match?: { __typename?: 'Match', id?: number }, state?: { __typename: 'MatchFinishedPhaseState', id: number, winTeamOne: boolean } | { __typename: 'MatchInProgressPhaseState', id: number, map?: CsMap } | { __typename: 'MatchPickAndBanPhaseState', id: number, firstTeamToBan: number, votingTimeInSeconds: number, actions: Array<{ __typename?: 'MatchPickAndBanPhaseAction', id?: number, ban: CsMap, captain: { __typename?: 'User', id?: number } }> } | { __typename: 'MatchReadyCheckPhaseState', id: number, teamOneAction: { __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction', ready: boolean }, teamTwoAction: { __typename?: 'MatchReadyCheckPhaseCaptainPerTeamAction', ready: boolean } } } } } } };

export type PublishTournamentMutationVariables = Exact<{
  tournamentId: Scalars['Int'];
}>;


export type PublishTournamentMutation = { __typename?: 'Mutation', publishTournament?: { __typename?: 'Tournament', id?: number, published: boolean } };

export type RemovePublicationFromTournamentMutationVariables = Exact<{
  tournamentId: Scalars['Int'];
}>;


export type RemovePublicationFromTournamentMutation = { __typename?: 'Mutation', removePublicationFromTournament?: { __typename?: 'Tournament', id?: number, published: boolean } };

export type GetTournamentRegistrationByPlayerQueryVariables = Exact<{
  tournamentId: Scalars['Int'];
  playerId: Scalars['Int'];
}>;


export type GetTournamentRegistrationByPlayerQuery = { __typename?: 'Query', getTournamentRegistrationByPlayer?: { __typename?: 'TournamentRegistration', id?: number, team: { __typename?: 'Team', id?: number, name: string, picture?: string, users: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> }, tournament?: { __typename?: 'Tournament', id?: number }, captain: { __typename?: 'User', id?: number }, players: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> } };

export type GetTournamentRegistrationByTeamQueryVariables = Exact<{
  tournamentId: Scalars['Int'];
  teamId: Scalars['Int'];
}>;


export type GetTournamentRegistrationByTeamQuery = { __typename?: 'Query', getTournamentRegistrationByTeam?: { __typename?: 'TournamentRegistration', id?: number, team: { __typename?: 'Team', id?: number }, captain: { __typename?: 'User', id?: number, playertag: string, picture?: string } } };

export type DeregisterTeamFromTournamentMutationVariables = Exact<{
  tournamentId: Scalars['Int'];
  teamId: Scalars['Int'];
}>;


export type DeregisterTeamFromTournamentMutation = { __typename?: 'Mutation', deregisterTeamFromTournament?: { __typename?: 'Tournament', id?: number, tournamentRegistrations: Array<{ __typename?: 'TournamentRegistration', id?: number, team: { __typename?: 'Team', id?: number, name: string, picture?: string }, players: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> }> } };

export type DeregisterPlayerFromTournamentMutationVariables = Exact<{
  tournamentId: Scalars['Int'];
  playerId: Scalars['Int'];
}>;


export type DeregisterPlayerFromTournamentMutation = { __typename?: 'Mutation', deregisterPlayerFromTournament?: { __typename?: 'Tournament', id?: number, tournamentRegistrations: Array<{ __typename?: 'TournamentRegistration', id?: number, team: { __typename?: 'Team', id?: number, name: string, picture?: string }, players: Array<{ __typename?: 'User', id?: number, playertag: string, picture?: string }> }> } };

export type StartTournamentMutationVariables = Exact<{
  tournamentId: Scalars['Int'];
}>;


export type StartTournamentMutation = { __typename?: 'Mutation', startTournament?: { __typename?: 'Tournament', id?: number } };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById?: { __typename?: 'User', id?: number, playertag: string, email: string, role: UserRole, description: string, picture?: string, createdTs: any, steamId?: string, teams: Array<{ __typename?: 'Team', id?: number, name: string, picture?: string, users: Array<{ __typename?: 'User', playertag: string }> }> } };

export type GetCurrentUserQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', id?: number, playertag: string, email: string, role: UserRole, picture?: string, teams: Array<{ __typename?: 'Team', id?: number, name: string, picture?: string, users: Array<{ __typename?: 'User', playertag: string }> }> } };

export type CreateUserMutationVariables = Exact<{
  playertag: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  passwordRepeated: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: string };

export type LoginUserMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser?: string };

export type UpdateUserMutationVariables = Exact<{
  editUserInput: EditUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'User', id?: number, email: string, description: string } };

export type ChangePasswordMutationVariables = Exact<{
  userId: Scalars['Int'];
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
  newPasswordRepeated: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword?: { __typename?: 'User', id?: number } };

export type SetSteamIdMutationVariables = Exact<{
  userId: Scalars['Int'];
  steamId: Scalars['String'];
}>;


export type SetSteamIdMutation = { __typename?: 'Mutation', setSteamId?: { __typename?: 'User', id?: number, steamId?: string } };

export type CreateTestMatchMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateTestMatchMutation = { __typename?: 'Mutation', createTestMatch?: { __typename?: 'Match', id?: number } };

export type ChangeMatchPhaseMutationVariables = Exact<{
  matchId: Scalars['Int'];
  changeMatchPhaseStrategy: ChangeMatchPhaseStrategy;
}>;


export type ChangeMatchPhaseMutation = { __typename?: 'Mutation', changeMatchPhase?: { __typename?: 'Match', id?: number, currentPhase: { __typename?: 'MatchPhase', id: number, phaseType: MatchPhaseType, createdTs: any, endTs?: any, state?: { __typename?: 'MatchFinishedPhaseState', id: number } | { __typename?: 'MatchInProgressPhaseState', id: number } | { __typename?: 'MatchPickAndBanPhaseState', id: number } | { __typename?: 'MatchReadyCheckPhaseState', id: number } } } };

export type HandleMatchFinishedMutationVariables = Exact<{
  matchId: Scalars['Int'];
  winningTeamId: Scalars['Int'];
}>;


export type HandleMatchFinishedMutation = { __typename?: 'Mutation', handleMatchFinished?: { __typename?: 'Match', id?: number } };

export type CreateTestDataMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateTestDataMutation = { __typename?: 'Mutation', createTestData?: { __typename?: 'Tournament', id?: number } };

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
    recipient {
      id
    }
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
    tournamentRegistration1 {
      team {
        id
        name
        picture
      }
      players {
        id
        playertag
        picture
      }
    }
    tournamentRegistration2 {
      team {
        id
        name
        picture
      }
      players {
        id
        playertag
        picture
      }
    }
    currentPhase {
      id
      phaseType
      createdTs
      endTs
      match {
        id
      }
      state {
        __typename
        ... on MatchReadyCheckPhaseState {
          id
          teamOneAction {
            ready
          }
          teamTwoAction {
            ready
          }
        }
        ... on MatchPickAndBanPhaseState {
          id
          firstTeamToBan
          votingTimeInSeconds
          actions {
            id
            captain {
              id
            }
            ban
          }
        }
        ... on MatchInProgressPhaseState {
          id
          map
        }
        ... on MatchFinishedPhaseState {
          id
          winTeamOne
        }
      }
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
export const GetMatchByIdDocument = gql`
    query getMatchById($matchId: Int!) {
  getMatchById(matchId: $matchId) {
    id
    tournamentRegistration1 {
      team {
        id
        name
        picture
      }
      players {
        id
        playertag
        picture
      }
      captain {
        id
        playertag
        picture
      }
    }
    tournamentRegistration2 {
      team {
        id
        name
        picture
      }
      players {
        id
        playertag
        picture
      }
      captain {
        id
        playertag
        picture
      }
    }
    chatMessages {
      sender {
        id
        playertag
      }
      message
      createdTs
    }
    currentPhase {
      id
      phaseType
      createdTs
      endTs
      match {
        id
      }
      state {
        __typename
        ... on MatchReadyCheckPhaseState {
          id
          teamOneAction {
            ready
          }
          teamTwoAction {
            ready
          }
        }
        ... on MatchPickAndBanPhaseState {
          id
          firstTeamToBan
          votingTimeInSeconds
          actions {
            id
            captain {
              id
            }
            ban
          }
        }
        ... on MatchInProgressPhaseState {
          id
          map
        }
        ... on MatchFinishedPhaseState {
          id
          winTeamOne
        }
      }
    }
  }
}
    `;

/**
 * __useGetMatchByIdQuery__
 *
 * To run a query within a React component, call `useGetMatchByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMatchByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMatchByIdQuery({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useGetMatchByIdQuery(baseOptions: Apollo.QueryHookOptions<GetMatchByIdQuery, GetMatchByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMatchByIdQuery, GetMatchByIdQueryVariables>(GetMatchByIdDocument, options);
      }
export function useGetMatchByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMatchByIdQuery, GetMatchByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMatchByIdQuery, GetMatchByIdQueryVariables>(GetMatchByIdDocument, options);
        }
export type GetMatchByIdQueryHookResult = ReturnType<typeof useGetMatchByIdQuery>;
export type GetMatchByIdLazyQueryHookResult = ReturnType<typeof useGetMatchByIdLazyQuery>;
export type GetMatchByIdQueryResult = Apollo.QueryResult<GetMatchByIdQuery, GetMatchByIdQueryVariables>;
export const MarkReadyDocument = gql`
    mutation markReady($matchId: Int!, $playerId: Int!) {
  markReady(matchId: $matchId, playerId: $playerId) {
    id
    currentPhase {
      id
      phaseType
      createdTs
      endTs
      state {
        __typename
        ... on MatchReadyCheckPhaseState {
          id
          teamOneAction {
            ready
          }
          teamTwoAction {
            ready
          }
        }
        ... on MatchPickAndBanPhaseState {
          id
          firstTeamToBan
          votingTimeInSeconds
          actions {
            id
            captain {
              id
            }
            ban
          }
        }
      }
    }
  }
}
    `;
export type MarkReadyMutationFn = Apollo.MutationFunction<MarkReadyMutation, MarkReadyMutationVariables>;

/**
 * __useMarkReadyMutation__
 *
 * To run a mutation, you first call `useMarkReadyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkReadyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markReadyMutation, { data, loading, error }] = useMarkReadyMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      playerId: // value for 'playerId'
 *   },
 * });
 */
export function useMarkReadyMutation(baseOptions?: Apollo.MutationHookOptions<MarkReadyMutation, MarkReadyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkReadyMutation, MarkReadyMutationVariables>(MarkReadyDocument, options);
      }
export type MarkReadyMutationHookResult = ReturnType<typeof useMarkReadyMutation>;
export type MarkReadyMutationResult = Apollo.MutationResult<MarkReadyMutation>;
export type MarkReadyMutationOptions = Apollo.BaseMutationOptions<MarkReadyMutation, MarkReadyMutationVariables>;
export const BanMapDocument = gql`
    mutation banMap($matchId: Int!, $playerId: Int!, $ban: CSMap!) {
  banMap(matchId: $matchId, playerId: $playerId, ban: $ban) {
    id
    currentPhase {
      id
      endTs
      state {
        __typename
        ... on MatchPickAndBanPhaseState {
          id
          firstTeamToBan
          votingTimeInSeconds
          actions {
            id
            captain {
              id
            }
            ban
          }
        }
        ... on MatchInProgressPhaseState {
          id
          map
        }
        ... on MatchFinishedPhaseState {
          id
          winTeamOne
        }
      }
    }
  }
}
    `;
export type BanMapMutationFn = Apollo.MutationFunction<BanMapMutation, BanMapMutationVariables>;

/**
 * __useBanMapMutation__
 *
 * To run a mutation, you first call `useBanMapMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBanMapMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [banMapMutation, { data, loading, error }] = useBanMapMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      playerId: // value for 'playerId'
 *      ban: // value for 'ban'
 *   },
 * });
 */
export function useBanMapMutation(baseOptions?: Apollo.MutationHookOptions<BanMapMutation, BanMapMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BanMapMutation, BanMapMutationVariables>(BanMapDocument, options);
      }
export type BanMapMutationHookResult = ReturnType<typeof useBanMapMutation>;
export type BanMapMutationResult = Apollo.MutationResult<BanMapMutation>;
export type BanMapMutationOptions = Apollo.BaseMutationOptions<BanMapMutation, BanMapMutationVariables>;
export const SendChatMessageDocument = gql`
    mutation sendChatMessage($matchId: Int!, $senderId: Int!, $message: String!) {
  sendChatMessage(matchId: $matchId, senderId: $senderId, message: $message) {
    id
    match {
      id
    }
    sender {
      id
      playertag
    }
    message
    createdTs
  }
}
    `;
export type SendChatMessageMutationFn = Apollo.MutationFunction<SendChatMessageMutation, SendChatMessageMutationVariables>;

/**
 * __useSendChatMessageMutation__
 *
 * To run a mutation, you first call `useSendChatMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendChatMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendChatMessageMutation, { data, loading, error }] = useSendChatMessageMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      senderId: // value for 'senderId'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useSendChatMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendChatMessageMutation, SendChatMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendChatMessageMutation, SendChatMessageMutationVariables>(SendChatMessageDocument, options);
      }
export type SendChatMessageMutationHookResult = ReturnType<typeof useSendChatMessageMutation>;
export type SendChatMessageMutationResult = Apollo.MutationResult<SendChatMessageMutation>;
export type SendChatMessageMutationOptions = Apollo.BaseMutationOptions<SendChatMessageMutation, SendChatMessageMutationVariables>;
export const OnMatchPhaseChangedDocument = gql`
    subscription onMatchPhaseChanged($matchId: Int!) {
  onMatchPhaseChanged(matchId: $matchId) {
    id
    phaseType
    createdTs
    endTs
    match {
      id
    }
    state {
      __typename
      ... on MatchReadyCheckPhaseState {
        id
        teamOneAction {
          ready
        }
        teamTwoAction {
          ready
        }
      }
      ... on MatchPickAndBanPhaseState {
        id
        firstTeamToBan
        votingTimeInSeconds
        actions {
          id
          captain {
            id
          }
          ban
        }
      }
      ... on MatchInProgressPhaseState {
        id
        map
      }
      ... on MatchFinishedPhaseState {
        id
        winTeamOne
      }
    }
  }
}
    `;

/**
 * __useOnMatchPhaseChangedSubscription__
 *
 * To run a query within a React component, call `useOnMatchPhaseChangedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnMatchPhaseChangedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnMatchPhaseChangedSubscription({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useOnMatchPhaseChangedSubscription(baseOptions: Apollo.SubscriptionHookOptions<OnMatchPhaseChangedSubscription, OnMatchPhaseChangedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnMatchPhaseChangedSubscription, OnMatchPhaseChangedSubscriptionVariables>(OnMatchPhaseChangedDocument, options);
      }
export type OnMatchPhaseChangedSubscriptionHookResult = ReturnType<typeof useOnMatchPhaseChangedSubscription>;
export type OnMatchPhaseChangedSubscriptionResult = Apollo.SubscriptionResult<OnMatchPhaseChangedSubscription>;
export const OnNewMatchChatMessageDocument = gql`
    subscription onNewMatchChatMessage($matchId: Int!) {
  onNewMatchChatMessage(matchId: $matchId) {
    id
    sender {
      id
      playertag
    }
    message
    createdTs
  }
}
    `;

/**
 * __useOnNewMatchChatMessageSubscription__
 *
 * To run a query within a React component, call `useOnNewMatchChatMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewMatchChatMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnNewMatchChatMessageSubscription({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useOnNewMatchChatMessageSubscription(baseOptions: Apollo.SubscriptionHookOptions<OnNewMatchChatMessageSubscription, OnNewMatchChatMessageSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnNewMatchChatMessageSubscription, OnNewMatchChatMessageSubscriptionVariables>(OnNewMatchChatMessageDocument, options);
      }
export type OnNewMatchChatMessageSubscriptionHookResult = ReturnType<typeof useOnNewMatchChatMessageSubscription>;
export type OnNewMatchChatMessageSubscriptionResult = Apollo.SubscriptionResult<OnNewMatchChatMessageSubscription>;
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
export const OnNewNotificationDocument = gql`
    subscription onNewNotification($userId: Int) {
  onNewNotification(userId: $userId) {
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
 * __useOnNewNotificationSubscription__
 *
 * To run a query within a React component, call `useOnNewNotificationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewNotificationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnNewNotificationSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useOnNewNotificationSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnNewNotificationSubscription, OnNewNotificationSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnNewNotificationSubscription, OnNewNotificationSubscriptionVariables>(OnNewNotificationDocument, options);
      }
export type OnNewNotificationSubscriptionHookResult = ReturnType<typeof useOnNewNotificationSubscription>;
export type OnNewNotificationSubscriptionResult = Apollo.SubscriptionResult<OnNewNotificationSubscription>;
export const GetSearchResultsDocument = gql`
    query getSearchResults($searchQuery: String!, $searchType: SearchType!) {
  getSearchResults(searchQuery: $searchQuery, searchType: $searchType) {
    ... on User {
      id
      playertag
      picture
      createdTs
    }
    ... on Team {
      id
      name
      picture
      createdTs
      owner {
        playertag
      }
      users {
        id
      }
    }
    ... on Tournament {
      id
      name
      picture
      startDateAndTime
      tournamentRegistrations {
        id
      }
    }
  }
}
    `;

/**
 * __useGetSearchResultsQuery__
 *
 * To run a query within a React component, call `useGetSearchResultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSearchResultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSearchResultsQuery({
 *   variables: {
 *      searchQuery: // value for 'searchQuery'
 *      searchType: // value for 'searchType'
 *   },
 * });
 */
export function useGetSearchResultsQuery(baseOptions: Apollo.QueryHookOptions<GetSearchResultsQuery, GetSearchResultsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSearchResultsQuery, GetSearchResultsQueryVariables>(GetSearchResultsDocument, options);
      }
export function useGetSearchResultsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSearchResultsQuery, GetSearchResultsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSearchResultsQuery, GetSearchResultsQueryVariables>(GetSearchResultsDocument, options);
        }
export type GetSearchResultsQueryHookResult = ReturnType<typeof useGetSearchResultsQuery>;
export type GetSearchResultsLazyQueryHookResult = ReturnType<typeof useGetSearchResultsLazyQuery>;
export type GetSearchResultsQueryResult = Apollo.QueryResult<GetSearchResultsQuery, GetSearchResultsQueryVariables>;
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
export const RegisterTeamOrPlayerDocument = gql`
    mutation registerTeamOrPlayer($tournamentId: Int!, $teamId: Int!, $playerId: Int!) {
  registerTeamOrPlayer(
    teamId: $teamId
    tournamentId: $tournamentId
    playerId: $playerId
  ) {
    id
    tournamentRegistrations {
      id
      captain {
        id
        playertag
        picture
      }
      team {
        id
        name
      }
    }
  }
}
    `;
export type RegisterTeamOrPlayerMutationFn = Apollo.MutationFunction<RegisterTeamOrPlayerMutation, RegisterTeamOrPlayerMutationVariables>;

/**
 * __useRegisterTeamOrPlayerMutation__
 *
 * To run a mutation, you first call `useRegisterTeamOrPlayerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterTeamOrPlayerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerTeamOrPlayerMutation, { data, loading, error }] = useRegisterTeamOrPlayerMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      teamId: // value for 'teamId'
 *      playerId: // value for 'playerId'
 *   },
 * });
 */
export function useRegisterTeamOrPlayerMutation(baseOptions?: Apollo.MutationHookOptions<RegisterTeamOrPlayerMutation, RegisterTeamOrPlayerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterTeamOrPlayerMutation, RegisterTeamOrPlayerMutationVariables>(RegisterTeamOrPlayerDocument, options);
      }
export type RegisterTeamOrPlayerMutationHookResult = ReturnType<typeof useRegisterTeamOrPlayerMutation>;
export type RegisterTeamOrPlayerMutationResult = Apollo.MutationResult<RegisterTeamOrPlayerMutation>;
export type RegisterTeamOrPlayerMutationOptions = Apollo.BaseMutationOptions<RegisterTeamOrPlayerMutation, RegisterTeamOrPlayerMutationVariables>;
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
    tournamentRegistrations {
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
        tournamentRegistration1 {
          team {
            id
            name
          }
        }
        tournamentRegistration2 {
          team {
            id
            name
          }
        }
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
    rules
    startDateAndTime
    numberOfTeamsAllowed
    tournamentRegistrations {
      id
      captain {
        id
        playertag
        picture
      }
      team {
        id
        name
        picture
      }
      players {
        id
        playertag
        picture
      }
      createdTs
    }
    bracket {
      id
      root {
        id
        tournamentRegistration1 {
          team {
            id
            name
            picture
          }
          players {
            id
            playertag
            picture
          }
        }
        tournamentRegistration2 {
          team {
            id
            name
            picture
          }
          players {
            id
            playertag
            picture
          }
        }
        currentPhase {
          id
          phaseType
          createdTs
          endTs
          match {
            id
          }
          state {
            __typename
            ... on MatchReadyCheckPhaseState {
              id
              teamOneAction {
                ready
              }
              teamTwoAction {
                ready
              }
            }
            ... on MatchPickAndBanPhaseState {
              id
              firstTeamToBan
              votingTimeInSeconds
              actions {
                id
                captain {
                  id
                }
                ban
              }
            }
            ... on MatchInProgressPhaseState {
              id
              map
            }
            ... on MatchFinishedPhaseState {
              id
              winTeamOne
            }
          }
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
export const PublishTournamentDocument = gql`
    mutation publishTournament($tournamentId: Int!) {
  publishTournament(tournamentId: $tournamentId) {
    id
    published
  }
}
    `;
export type PublishTournamentMutationFn = Apollo.MutationFunction<PublishTournamentMutation, PublishTournamentMutationVariables>;

/**
 * __usePublishTournamentMutation__
 *
 * To run a mutation, you first call `usePublishTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishTournamentMutation, { data, loading, error }] = usePublishTournamentMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function usePublishTournamentMutation(baseOptions?: Apollo.MutationHookOptions<PublishTournamentMutation, PublishTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishTournamentMutation, PublishTournamentMutationVariables>(PublishTournamentDocument, options);
      }
export type PublishTournamentMutationHookResult = ReturnType<typeof usePublishTournamentMutation>;
export type PublishTournamentMutationResult = Apollo.MutationResult<PublishTournamentMutation>;
export type PublishTournamentMutationOptions = Apollo.BaseMutationOptions<PublishTournamentMutation, PublishTournamentMutationVariables>;
export const RemovePublicationFromTournamentDocument = gql`
    mutation removePublicationFromTournament($tournamentId: Int!) {
  removePublicationFromTournament(tournamentId: $tournamentId) {
    id
    published
  }
}
    `;
export type RemovePublicationFromTournamentMutationFn = Apollo.MutationFunction<RemovePublicationFromTournamentMutation, RemovePublicationFromTournamentMutationVariables>;

/**
 * __useRemovePublicationFromTournamentMutation__
 *
 * To run a mutation, you first call `useRemovePublicationFromTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePublicationFromTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePublicationFromTournamentMutation, { data, loading, error }] = useRemovePublicationFromTournamentMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useRemovePublicationFromTournamentMutation(baseOptions?: Apollo.MutationHookOptions<RemovePublicationFromTournamentMutation, RemovePublicationFromTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePublicationFromTournamentMutation, RemovePublicationFromTournamentMutationVariables>(RemovePublicationFromTournamentDocument, options);
      }
export type RemovePublicationFromTournamentMutationHookResult = ReturnType<typeof useRemovePublicationFromTournamentMutation>;
export type RemovePublicationFromTournamentMutationResult = Apollo.MutationResult<RemovePublicationFromTournamentMutation>;
export type RemovePublicationFromTournamentMutationOptions = Apollo.BaseMutationOptions<RemovePublicationFromTournamentMutation, RemovePublicationFromTournamentMutationVariables>;
export const GetTournamentRegistrationByPlayerDocument = gql`
    query getTournamentRegistrationByPlayer($tournamentId: Int!, $playerId: Int!) {
  getTournamentRegistrationByPlayer(
    tournamentId: $tournamentId
    playerId: $playerId
  ) {
    id
    team {
      id
      name
      picture
      users {
        id
        playertag
        picture
      }
    }
    tournament {
      id
    }
    captain {
      id
    }
    players {
      id
      playertag
      picture
    }
  }
}
    `;

/**
 * __useGetTournamentRegistrationByPlayerQuery__
 *
 * To run a query within a React component, call `useGetTournamentRegistrationByPlayerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTournamentRegistrationByPlayerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTournamentRegistrationByPlayerQuery({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      playerId: // value for 'playerId'
 *   },
 * });
 */
export function useGetTournamentRegistrationByPlayerQuery(baseOptions: Apollo.QueryHookOptions<GetTournamentRegistrationByPlayerQuery, GetTournamentRegistrationByPlayerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTournamentRegistrationByPlayerQuery, GetTournamentRegistrationByPlayerQueryVariables>(GetTournamentRegistrationByPlayerDocument, options);
      }
export function useGetTournamentRegistrationByPlayerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTournamentRegistrationByPlayerQuery, GetTournamentRegistrationByPlayerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTournamentRegistrationByPlayerQuery, GetTournamentRegistrationByPlayerQueryVariables>(GetTournamentRegistrationByPlayerDocument, options);
        }
export type GetTournamentRegistrationByPlayerQueryHookResult = ReturnType<typeof useGetTournamentRegistrationByPlayerQuery>;
export type GetTournamentRegistrationByPlayerLazyQueryHookResult = ReturnType<typeof useGetTournamentRegistrationByPlayerLazyQuery>;
export type GetTournamentRegistrationByPlayerQueryResult = Apollo.QueryResult<GetTournamentRegistrationByPlayerQuery, GetTournamentRegistrationByPlayerQueryVariables>;
export const GetTournamentRegistrationByTeamDocument = gql`
    query getTournamentRegistrationByTeam($tournamentId: Int!, $teamId: Int!) {
  getTournamentRegistrationByTeam(tournamentId: $tournamentId, teamId: $teamId) {
    id
    team {
      id
    }
    captain {
      id
      playertag
      picture
    }
  }
}
    `;

/**
 * __useGetTournamentRegistrationByTeamQuery__
 *
 * To run a query within a React component, call `useGetTournamentRegistrationByTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTournamentRegistrationByTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTournamentRegistrationByTeamQuery({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useGetTournamentRegistrationByTeamQuery(baseOptions: Apollo.QueryHookOptions<GetTournamentRegistrationByTeamQuery, GetTournamentRegistrationByTeamQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTournamentRegistrationByTeamQuery, GetTournamentRegistrationByTeamQueryVariables>(GetTournamentRegistrationByTeamDocument, options);
      }
export function useGetTournamentRegistrationByTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTournamentRegistrationByTeamQuery, GetTournamentRegistrationByTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTournamentRegistrationByTeamQuery, GetTournamentRegistrationByTeamQueryVariables>(GetTournamentRegistrationByTeamDocument, options);
        }
export type GetTournamentRegistrationByTeamQueryHookResult = ReturnType<typeof useGetTournamentRegistrationByTeamQuery>;
export type GetTournamentRegistrationByTeamLazyQueryHookResult = ReturnType<typeof useGetTournamentRegistrationByTeamLazyQuery>;
export type GetTournamentRegistrationByTeamQueryResult = Apollo.QueryResult<GetTournamentRegistrationByTeamQuery, GetTournamentRegistrationByTeamQueryVariables>;
export const DeregisterTeamFromTournamentDocument = gql`
    mutation deregisterTeamFromTournament($tournamentId: Int!, $teamId: Int!) {
  deregisterTeamFromTournament(tournamentId: $tournamentId, teamId: $teamId) {
    id
    tournamentRegistrations {
      id
      team {
        id
        name
        picture
      }
      players {
        id
        playertag
        picture
      }
    }
  }
}
    `;
export type DeregisterTeamFromTournamentMutationFn = Apollo.MutationFunction<DeregisterTeamFromTournamentMutation, DeregisterTeamFromTournamentMutationVariables>;

/**
 * __useDeregisterTeamFromTournamentMutation__
 *
 * To run a mutation, you first call `useDeregisterTeamFromTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeregisterTeamFromTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deregisterTeamFromTournamentMutation, { data, loading, error }] = useDeregisterTeamFromTournamentMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useDeregisterTeamFromTournamentMutation(baseOptions?: Apollo.MutationHookOptions<DeregisterTeamFromTournamentMutation, DeregisterTeamFromTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeregisterTeamFromTournamentMutation, DeregisterTeamFromTournamentMutationVariables>(DeregisterTeamFromTournamentDocument, options);
      }
export type DeregisterTeamFromTournamentMutationHookResult = ReturnType<typeof useDeregisterTeamFromTournamentMutation>;
export type DeregisterTeamFromTournamentMutationResult = Apollo.MutationResult<DeregisterTeamFromTournamentMutation>;
export type DeregisterTeamFromTournamentMutationOptions = Apollo.BaseMutationOptions<DeregisterTeamFromTournamentMutation, DeregisterTeamFromTournamentMutationVariables>;
export const DeregisterPlayerFromTournamentDocument = gql`
    mutation deregisterPlayerFromTournament($tournamentId: Int!, $playerId: Int!) {
  deregisterPlayerFromTournament(tournamentId: $tournamentId, playerId: $playerId) {
    id
    tournamentRegistrations {
      id
      team {
        id
        name
        picture
      }
      players {
        id
        playertag
        picture
      }
    }
  }
}
    `;
export type DeregisterPlayerFromTournamentMutationFn = Apollo.MutationFunction<DeregisterPlayerFromTournamentMutation, DeregisterPlayerFromTournamentMutationVariables>;

/**
 * __useDeregisterPlayerFromTournamentMutation__
 *
 * To run a mutation, you first call `useDeregisterPlayerFromTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeregisterPlayerFromTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deregisterPlayerFromTournamentMutation, { data, loading, error }] = useDeregisterPlayerFromTournamentMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      playerId: // value for 'playerId'
 *   },
 * });
 */
export function useDeregisterPlayerFromTournamentMutation(baseOptions?: Apollo.MutationHookOptions<DeregisterPlayerFromTournamentMutation, DeregisterPlayerFromTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeregisterPlayerFromTournamentMutation, DeregisterPlayerFromTournamentMutationVariables>(DeregisterPlayerFromTournamentDocument, options);
      }
export type DeregisterPlayerFromTournamentMutationHookResult = ReturnType<typeof useDeregisterPlayerFromTournamentMutation>;
export type DeregisterPlayerFromTournamentMutationResult = Apollo.MutationResult<DeregisterPlayerFromTournamentMutation>;
export type DeregisterPlayerFromTournamentMutationOptions = Apollo.BaseMutationOptions<DeregisterPlayerFromTournamentMutation, DeregisterPlayerFromTournamentMutationVariables>;
export const StartTournamentDocument = gql`
    mutation startTournament($tournamentId: Int!) {
  startTournament(tournamentId: $tournamentId) {
    id
  }
}
    `;
export type StartTournamentMutationFn = Apollo.MutationFunction<StartTournamentMutation, StartTournamentMutationVariables>;

/**
 * __useStartTournamentMutation__
 *
 * To run a mutation, you first call `useStartTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startTournamentMutation, { data, loading, error }] = useStartTournamentMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useStartTournamentMutation(baseOptions?: Apollo.MutationHookOptions<StartTournamentMutation, StartTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartTournamentMutation, StartTournamentMutationVariables>(StartTournamentDocument, options);
      }
export type StartTournamentMutationHookResult = ReturnType<typeof useStartTournamentMutation>;
export type StartTournamentMutationResult = Apollo.MutationResult<StartTournamentMutation>;
export type StartTournamentMutationOptions = Apollo.BaseMutationOptions<StartTournamentMutation, StartTournamentMutationVariables>;
export const GetUserByIdDocument = gql`
    query getUserById($id: Int!) {
  getUserById(id: $id) {
    id
    playertag
    email
    role
    description
    picture
    createdTs
    teams {
      id
      name
      picture
      users {
        playertag
      }
    }
    steamId
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
    mutation createUser($playertag: String!, $email: String!, $password: String!, $passwordRepeated: String!) {
  createUser(
    playertag: $playertag
    email: $email
    password: $password
    passwordRepeated: $passwordRepeated
  )
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
 *      passwordRepeated: // value for 'passwordRepeated'
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
export const UpdateUserDocument = gql`
    mutation updateUser($editUserInput: EditUserInput!) {
  updateUser(editUserInput: $editUserInput) {
    id
    email
    description
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      editUserInput: // value for 'editUserInput'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation changePassword($userId: Int!, $currentPassword: String!, $newPassword: String!, $newPasswordRepeated: String!) {
  changePassword(
    userId: $userId
    currentPassword: $currentPassword
    newPassword: $newPassword
    newPasswordRepeated: $newPasswordRepeated
  ) {
    id
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      currentPassword: // value for 'currentPassword'
 *      newPassword: // value for 'newPassword'
 *      newPasswordRepeated: // value for 'newPasswordRepeated'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const SetSteamIdDocument = gql`
    mutation setSteamId($userId: Int!, $steamId: String!) {
  setSteamId(userId: $userId, steamId: $steamId) {
    id
    steamId
  }
}
    `;
export type SetSteamIdMutationFn = Apollo.MutationFunction<SetSteamIdMutation, SetSteamIdMutationVariables>;

/**
 * __useSetSteamIdMutation__
 *
 * To run a mutation, you first call `useSetSteamIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSteamIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSteamIdMutation, { data, loading, error }] = useSetSteamIdMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      steamId: // value for 'steamId'
 *   },
 * });
 */
export function useSetSteamIdMutation(baseOptions?: Apollo.MutationHookOptions<SetSteamIdMutation, SetSteamIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSteamIdMutation, SetSteamIdMutationVariables>(SetSteamIdDocument, options);
      }
export type SetSteamIdMutationHookResult = ReturnType<typeof useSetSteamIdMutation>;
export type SetSteamIdMutationResult = Apollo.MutationResult<SetSteamIdMutation>;
export type SetSteamIdMutationOptions = Apollo.BaseMutationOptions<SetSteamIdMutation, SetSteamIdMutationVariables>;
export const CreateTestMatchDocument = gql`
    mutation createTestMatch {
  createTestMatch {
    id
  }
}
    `;
export type CreateTestMatchMutationFn = Apollo.MutationFunction<CreateTestMatchMutation, CreateTestMatchMutationVariables>;

/**
 * __useCreateTestMatchMutation__
 *
 * To run a mutation, you first call `useCreateTestMatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTestMatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTestMatchMutation, { data, loading, error }] = useCreateTestMatchMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateTestMatchMutation(baseOptions?: Apollo.MutationHookOptions<CreateTestMatchMutation, CreateTestMatchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTestMatchMutation, CreateTestMatchMutationVariables>(CreateTestMatchDocument, options);
      }
export type CreateTestMatchMutationHookResult = ReturnType<typeof useCreateTestMatchMutation>;
export type CreateTestMatchMutationResult = Apollo.MutationResult<CreateTestMatchMutation>;
export type CreateTestMatchMutationOptions = Apollo.BaseMutationOptions<CreateTestMatchMutation, CreateTestMatchMutationVariables>;
export const ChangeMatchPhaseDocument = gql`
    mutation changeMatchPhase($matchId: Int!, $changeMatchPhaseStrategy: ChangeMatchPhaseStrategy!) {
  changeMatchPhase(
    matchId: $matchId
    changeMatchPhaseStrategy: $changeMatchPhaseStrategy
  ) {
    id
    currentPhase {
      id
      phaseType
      createdTs
      endTs
      state {
        ... on MatchPhaseState {
          id
        }
        ... on MatchReadyCheckPhaseState {
          id
        }
      }
    }
  }
}
    `;
export type ChangeMatchPhaseMutationFn = Apollo.MutationFunction<ChangeMatchPhaseMutation, ChangeMatchPhaseMutationVariables>;

/**
 * __useChangeMatchPhaseMutation__
 *
 * To run a mutation, you first call `useChangeMatchPhaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeMatchPhaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeMatchPhaseMutation, { data, loading, error }] = useChangeMatchPhaseMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      changeMatchPhaseStrategy: // value for 'changeMatchPhaseStrategy'
 *   },
 * });
 */
export function useChangeMatchPhaseMutation(baseOptions?: Apollo.MutationHookOptions<ChangeMatchPhaseMutation, ChangeMatchPhaseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeMatchPhaseMutation, ChangeMatchPhaseMutationVariables>(ChangeMatchPhaseDocument, options);
      }
export type ChangeMatchPhaseMutationHookResult = ReturnType<typeof useChangeMatchPhaseMutation>;
export type ChangeMatchPhaseMutationResult = Apollo.MutationResult<ChangeMatchPhaseMutation>;
export type ChangeMatchPhaseMutationOptions = Apollo.BaseMutationOptions<ChangeMatchPhaseMutation, ChangeMatchPhaseMutationVariables>;
export const HandleMatchFinishedDocument = gql`
    mutation handleMatchFinished($matchId: Int!, $winningTeamId: Int!) {
  handleMatchFinished(matchId: $matchId, winningTeamId: $winningTeamId) {
    id
  }
}
    `;
export type HandleMatchFinishedMutationFn = Apollo.MutationFunction<HandleMatchFinishedMutation, HandleMatchFinishedMutationVariables>;

/**
 * __useHandleMatchFinishedMutation__
 *
 * To run a mutation, you first call `useHandleMatchFinishedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHandleMatchFinishedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [handleMatchFinishedMutation, { data, loading, error }] = useHandleMatchFinishedMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      winningTeamId: // value for 'winningTeamId'
 *   },
 * });
 */
export function useHandleMatchFinishedMutation(baseOptions?: Apollo.MutationHookOptions<HandleMatchFinishedMutation, HandleMatchFinishedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HandleMatchFinishedMutation, HandleMatchFinishedMutationVariables>(HandleMatchFinishedDocument, options);
      }
export type HandleMatchFinishedMutationHookResult = ReturnType<typeof useHandleMatchFinishedMutation>;
export type HandleMatchFinishedMutationResult = Apollo.MutationResult<HandleMatchFinishedMutation>;
export type HandleMatchFinishedMutationOptions = Apollo.BaseMutationOptions<HandleMatchFinishedMutation, HandleMatchFinishedMutationVariables>;
export const CreateTestDataDocument = gql`
    mutation createTestData {
  createTestData {
    id
  }
}
    `;
export type CreateTestDataMutationFn = Apollo.MutationFunction<CreateTestDataMutation, CreateTestDataMutationVariables>;

/**
 * __useCreateTestDataMutation__
 *
 * To run a mutation, you first call `useCreateTestDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTestDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTestDataMutation, { data, loading, error }] = useCreateTestDataMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateTestDataMutation(baseOptions?: Apollo.MutationHookOptions<CreateTestDataMutation, CreateTestDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTestDataMutation, CreateTestDataMutationVariables>(CreateTestDataDocument, options);
      }
export type CreateTestDataMutationHookResult = ReturnType<typeof useCreateTestDataMutation>;
export type CreateTestDataMutationResult = Apollo.MutationResult<CreateTestDataMutation>;
export type CreateTestDataMutationOptions = Apollo.BaseMutationOptions<CreateTestDataMutation, CreateTestDataMutationVariables>;
export const ListAllOperations = {
  Query: {
    findAllInvitesForPlayer: 'findAllInvitesForPlayer',
    findPendingInvitesForPlayer: 'findPendingInvitesForPlayer',
    getMatchesByParentIds: 'getMatchesByParentIds',
    getMatchById: 'getMatchById',
    getAllNotifications: 'getAllNotifications',
    getSearchResults: 'getSearchResults',
    getAllTeams: 'getAllTeams',
    getTeamById: 'getTeamById',
    getAllTournaments: 'getAllTournaments',
    getTournamentById: 'getTournamentById',
    getTournamentRegistrationByPlayer: 'getTournamentRegistrationByPlayer',
    getTournamentRegistrationByTeam: 'getTournamentRegistrationByTeam',
    getUserById: 'getUserById',
    getCurrentUser: 'getCurrentUser'
  },
  Mutation: {
    acceptInvitation: 'acceptInvitation',
    declineInvitation: 'declineInvitation',
    createInviteToTeam: 'createInviteToTeam',
    markReady: 'markReady',
    banMap: 'banMap',
    sendChatMessage: 'sendChatMessage',
    markAllNotificationsAsSeenForUser: 'markAllNotificationsAsSeenForUser',
    setPictureAndGetPresignedRequest: 'setPictureAndGetPresignedRequest',
    registerTeamOrPlayer: 'registerTeamOrPlayer',
    incrementWins: 'incrementWins',
    incrementLosses: 'incrementLosses',
    createTeam: 'createTeam',
    createTournament: 'createTournament',
    generateBracket: 'generateBracket',
    publishTournament: 'publishTournament',
    removePublicationFromTournament: 'removePublicationFromTournament',
    deregisterTeamFromTournament: 'deregisterTeamFromTournament',
    deregisterPlayerFromTournament: 'deregisterPlayerFromTournament',
    startTournament: 'startTournament',
    createUser: 'createUser',
    loginUser: 'loginUser',
    updateUser: 'updateUser',
    changePassword: 'changePassword',
    setSteamId: 'setSteamId',
    createTestMatch: 'createTestMatch',
    changeMatchPhase: 'changeMatchPhase',
    handleMatchFinished: 'handleMatchFinished',
    createTestData: 'createTestData'
  },
  Subscription: {
    onMatchPhaseChanged: 'onMatchPhaseChanged',
    onNewMatchChatMessage: 'onNewMatchChatMessage',
    onNewNotification: 'onNewNotification'
  },
  Fragment: {
    NewNotification: 'NewNotification'
  }
}