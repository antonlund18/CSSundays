import { expect } from "vitest";
import { yoga } from "../app.js";
import { prisma } from "../db.js";
import type { UserRole } from "../generated/prisma/client.js";
import { createSession, hashPassword } from "../schema/auth/auth.service.js";

type GraphQLResponse<T> = { data?: T; errors?: { message: string; extensions?: { code?: string } }[] };

/** Executes an operation against the real Yoga server (no network). */
export async function gql<T = Record<string, unknown>>(
  query: string,
  variables: Record<string, unknown> = {},
  token?: string,
): Promise<GraphQLResponse<T>> {
  const response = await yoga.fetch("http://test/graphql", {
    method: "POST",
    headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query, variables }),
  });
  return (await response.json()) as GraphQLResponse<T>;
}

/** Like gql() but fails the test on errors. */
export async function ok<T = Record<string, unknown>>(query: string, variables?: Record<string, unknown>, token?: string) {
  const result = await gql<T>(query, variables, token);
  expect(result.errors, JSON.stringify(result.errors)).toBeUndefined();
  return result.data as T;
}

/** Expects the operation to fail with the given error code. */
export async function rejects(code: string, query: string, variables?: Record<string, unknown>, token?: string) {
  const result = await gql(query, variables, token);
  expect(result.errors?.[0]?.message, JSON.stringify(result)).toBe(code);
}

let passwordHash: Promise<string> | null = null;

export async function createUser(playertag: string, role: UserRole = "USER") {
  passwordHash ??= hashPassword("password123");
  const user = await prisma.user.create({
    data: {
      email: `${playertag.toLowerCase()}@test.local`,
      emailVerifiedAt: new Date(),
      passwordHash: await passwordHash,
      playertag,
      playertagKey: playertag.toLowerCase(),
      role,
    },
  });
  return { user, token: await createSession(user.id) };
}

export async function createTeam(name: string, memberIds: string[]) {
  return prisma.team.create({
    data: {
      name,
      nameKey: name.toLowerCase(),
      ownerId: memberIds[0],
      members: { create: memberIds.map((userId) => ({ userId })) },
    },
  });
}

let counter = 0;

/** A published, open tournament with `teams` single-player teams registered in order. */
export async function createTournamentWithTeams(teams: number, maxTeams = 64) {
  const suffix = ++counter;
  const tournament = await prisma.tournament.create({
    data: { name: `Test cup ${suffix}`, startsAt: new Date(Date.now() + 86_400_000), maxTeams, published: true },
  });
  const captains: { userId: string; token: string; registrationId: number }[] = [];
  for (let i = 1; i <= teams; i++) {
    const { user, token } = await createUser(`c${suffix}x${i}`);
    const team = await createTeam(`Team ${suffix}-${i}`, [user.id]);
    const registration = await prisma.tournamentRegistration.create({
      data: {
        tournamentId: tournament.id,
        teamId: team.id,
        captainId: user.id,
        createdAt: new Date(Date.now() + i * 1000),
        players: { create: { tournamentId: tournament.id, userId: user.id } },
      },
    });
    captains.push({ userId: user.id, token, registrationId: registration.id });
  }
  return { tournament, captains };
}
