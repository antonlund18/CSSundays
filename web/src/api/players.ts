import { queryOptions } from "@tanstack/react-query";
import { graphql, request, upload, type ResultOf } from "@/lib/graphql";

export type UserRole = "ADMIN" | "ORGANIZER" | "USER";

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  ORGANIZER: "Arrangør",
  USER: "Spiller",
};

const MeQuery = graphql(`
  query Me {
    me { id playertag avatarUrl description steamId role createdAt email emailVerified }
  }
`);

export type Me = NonNullable<ResultOf<typeof MeQuery>["me"]>;

export const meQuery = () => queryOptions({ queryKey: ["me"], queryFn: async () => (await request(MeQuery)).me });

const PlayerQuery = graphql(`
  query Player($playertag: String!) {
    player(playertag: $playertag) {
      id playertag avatarUrl description steamId role createdAt
      teams { id name avatarUrl ownerId }
    }
  }
`);

export type Player = NonNullable<ResultOf<typeof PlayerQuery>["player"]>;

export const playerQuery = (playertag: string) =>
  queryOptions({
    queryKey: ["player", playertag.toLowerCase()],
    queryFn: async () => (await request(PlayerQuery, { playertag })).player,
  });

const PlayersQuery = graphql(`
  query Players { players { id playertag avatarUrl steamId role createdAt } }
`);

export const allPlayersQuery = () =>
  queryOptions({ queryKey: ["players"], queryFn: async () => (await request(PlayersQuery)).players });

const PlayertagAvailableQuery = graphql(`
  query PlayertagAvailable($playertag: String!) { playertagAvailable(playertag: $playertag) }
`);

export async function isPlayertagAvailable(playertag: string) {
  return (await request(PlayertagAvailableQuery, { playertag })).playertagAvailable;
}

const UpdateProfileMutation = graphql(`
  mutation UpdateProfile($description: String!) { updateProfile(description: $description) { id } }
`);

export async function updateProfile(description: string) {
  await request(UpdateProfileMutation, { description });
}

const UploadImageMutation = graphql(`
  mutation UploadImage($target: ImageTarget!, $id: Int, $file: File!) { uploadImage(target: $target, id: $id, file: $file) }
`);

export async function uploadImage(target: "AVATAR" | "TEAM" | "TOURNAMENT", file: File, id?: number) {
  return (await upload(UploadImageMutation, { target, id: id ?? null, file })).uploadImage;
}

const LinkSteamMutation = graphql(`
  mutation LinkSteam($params: JSON!) { linkSteam(params: $params) { id steamId } }
`);

export async function linkSteam(params: Record<string, string>) {
  await request(LinkSteamMutation, { params });
}

const UnlinkSteamMutation = graphql(`
  mutation UnlinkSteam { unlinkSteam { id } }
`);

export async function unlinkSteam() {
  await request(UnlinkSteamMutation);
}

const SetUserRoleMutation = graphql(`
  mutation SetUserRole($userId: ID!, $role: UserRole!) { setUserRole(userId: $userId, role: $role) { id role } }
`);

export async function setUserRole(userId: string, role: UserRole) {
  await request(SetUserRoleMutation, { userId, role });
}
