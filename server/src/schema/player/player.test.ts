import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../db.js";
import { createUser, ok, rejects } from "../../test/helpers.js";
import { linkSteam } from "./steam.service.js";

describe("roles and staff-only actions", () => {
  let admin: { token: string; user: { id: string } };
  let player: { token: string; user: { id: string } };

  beforeAll(async () => {
    admin = await createUser("roleadmin", "ADMIN");
    player = await createUser("roleplayer");
  });

  it("lets only admins change roles, and not their own", async () => {
    const setRole = `mutation ($id: ID!, $role: UserRole!) { setUserRole(userId: $id, role: $role) { role } }`;
    await rejects("FORBIDDEN", setRole, { id: player.user.id, role: "ADMIN" }, player.token);
    await rejects("CANNOT_DEMOTE_SELF", setRole, { id: admin.user.id, role: "USER" }, admin.token);
    await ok(setRole, { id: player.user.id, role: "ORGANIZER" }, admin.token);
    await prisma.user.update({ where: { id: player.user.id }, data: { role: "USER" } });
  });

  it("hides unpublished tournaments from players", async () => {
    const create = `mutation ($input: TournamentInput!) { createTournament(input: $input) { id } }`;
    const input = { name: "Hidden cup", description: "", rules: "", startsAt: new Date().toISOString(), maxTeams: 8, published: false };
    await rejects("FORBIDDEN", create, { input }, player.token);
    await rejects("INVALID_INPUT", create, { input: { ...input, maxTeams: 12 } }, admin.token);
    const { createTournament } = await ok<{ createTournament: { id: number } }>(create, { input }, admin.token);

    const query = `query ($id: Int!) { tournament(id: $id) { id } }`;
    expect((await ok<{ tournament: null }>(query, { id: createTournament.id }, player.token)).tournament).toBeNull();
    expect((await ok<{ tournament: { id: number } }>(query, { id: createTournament.id }, admin.token)).tournament).not.toBeNull();
  });
});


describe("Steam linking", () => {
  const params = (overrides: Record<string, string> = {}) => ({
    "openid.mode": "id_res",
    "openid.op_endpoint": "https://steamcommunity.com/openid/login",
    "openid.claimed_id": "https://steamcommunity.com/openid/id/76561197960287930",
    "openid.identity": "https://steamcommunity.com/openid/id/76561197960287930",
    "openid.return_to": "http://localhost:5173/steam/callback",
    "openid.response_nonce": `${new Date().toISOString().slice(0, 19)}Zabc`,
    ...overrides,
  });

  it("stores the Steam id only when Steam confirms the assertion", async () => {
    const { user } = await createUser("steamer");
    await expect(linkSteam(user, params(), async () => false)).rejects.toThrow("STEAM_VERIFICATION_FAILED");
    await expect(linkSteam(user, params({ "openid.return_to": "https://evil.example/cb" }), async () => true)).rejects.toThrow(
      "STEAM_VERIFICATION_FAILED",
    );
    await expect(linkSteam(user, params({ "openid.response_nonce": "2020-01-01T00:00:00Zold" }), async () => true)).rejects.toThrow(
      "STEAM_VERIFICATION_FAILED",
    );
    expect((await linkSteam(user, params(), async () => true)).steamId).toBe("76561197960287930");

    const { user: other } = await createUser("steamer2");
    await expect(linkSteam(other, params(), async () => true)).rejects.toThrow("STEAM_ALREADY_LINKED");
  });
});
