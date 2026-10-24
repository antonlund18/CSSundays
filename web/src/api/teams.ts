import { queryOptions } from "@tanstack/react-query";
import { graphql, request, type ResultOf } from "@/lib/graphql";

const TeamsQuery = graphql(`
  query Teams { teams { id name avatarUrl wins losses createdAt memberCount } }
`);

export const teamsQuery = () => queryOptions({ queryKey: ["teams"], queryFn: async () => (await request(TeamsQuery)).teams });

const TeamQuery = graphql(`
  query Team($id: Int!) {
    team(id: $id) {
      id name avatarUrl wins losses createdAt ownerId
      owner { id playertag avatarUrl }
      members { id playertag avatarUrl steamId }
    }
  }
`);

export type TeamDetails = NonNullable<ResultOf<typeof TeamQuery>["team"]>;

export const teamQuery = (id: number) =>
  queryOptions({ queryKey: ["team", id], queryFn: async () => (await request(TeamQuery, { id })).team });

const MyTeamsQuery = graphql(`
  query MyTeams { myTeams { id name avatarUrl ownerId } }
`);

/** Teams the current player is a member of. */
export const myTeamsQuery = (userId: string) =>
  queryOptions({ queryKey: ["my-teams", userId], queryFn: async () => (await request(MyTeamsQuery)).myTeams });

const InvitesForQuery = graphql(`
  query InvitesFor($userId: ID!) {
    invitesFor(userId: $userId) {
      id status createdAt
      team { id name avatarUrl }
      sender { id playertag }
    }
  }
`);

/** Invites addressed to a player that the current user is allowed to see. */
export const invitesForPlayerQuery = (userId: string) =>
  queryOptions({ queryKey: ["invites", userId], queryFn: async () => (await request(InvitesForQuery, { userId })).invitesFor });

const CreateTeamMutation = graphql(`
  mutation CreateTeam($name: String!) { createTeam(name: $name) { id } }
`);

export async function createTeam(name: string): Promise<number> {
  return (await request(CreateTeamMutation, { name })).createTeam.id;
}

const InviteToTeamMutation = graphql(`
  mutation InviteToTeam($teamId: Int!, $recipientId: ID!) { inviteToTeam(teamId: $teamId, recipientId: $recipientId) { id } }
`);

export async function inviteToTeam(teamId: number, recipientId: string) {
  await request(InviteToTeamMutation, { teamId, recipientId });
}

const RespondToInviteMutation = graphql(`
  mutation RespondToInvite($inviteId: Int!, $accept: Boolean!) { respondToInvite(inviteId: $inviteId, accept: $accept) { id status } }
`);

export async function respondToInvite(inviteId: number, accept: boolean) {
  await request(RespondToInviteMutation, { inviteId, accept });
}

const LeaveTeamMutation = graphql(`
  mutation LeaveTeam($teamId: Int!) { leaveTeam(teamId: $teamId) }
`);

export async function leaveTeam(teamId: number) {
  await request(LeaveTeamMutation, { teamId });
}

const RemoveTeamMemberMutation = graphql(`
  mutation RemoveTeamMember($teamId: Int!, $userId: ID!) { removeTeamMember(teamId: $teamId, userId: $userId) }
`);

export async function removeTeamMember(teamId: number, userId: string) {
  await request(RemoveTeamMemberMutation, { teamId, userId });
}
