import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import { DateTimeResolver, JSONResolver } from "graphql-scalars";
import { prisma } from "../db.js";
import { env } from "../env.js";
import type { User } from "../generated/prisma/client.js";
import type PrismaTypes from "../generated/pothos-types.js";
import { getDatamodel } from "../generated/pothos-types.js";
import { AppError } from "../lib/errors.js";
import { isStaff } from "./auth/auth.service.js";

export type Context = {
  user: User | null;
  /** The bearer token of the current session, if any. */
  token: string | null;
};

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
  AuthScopes: { loggedIn: boolean; staff: boolean; admin: boolean };
  DefaultFieldNullability: false;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
    JSON: { Input: unknown; Output: unknown };
    File: { Input: File; Output: never };
  };
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin],
  defaultFieldNullability: false,
  scopeAuth: {
    authScopes: (context) => ({
      loggedIn: !!context.user,
      staff: isStaff(context.user),
      admin: context.user?.role === "ADMIN",
    }),
    unauthorizedError: (_parent, context) => new AppError(context.user ? "FORBIDDEN" : "NOT_AUTHENTICATED"),
  },
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
    onUnusedQuery: env.NODE_ENV === "development" ? "warn" : null,
  },
});

builder.addScalarType("DateTime", DateTimeResolver);
builder.addScalarType("JSON", JSONResolver);
// Uploaded files arrive through the GraphQL multipart request spec, which Yoga handles.
builder.scalarType("File", {
  serialize: () => {
    throw new Error("File is an input-only scalar");
  },
  parseValue: (value) => value as File,
});

builder.queryType({});
builder.mutationType({});
builder.subscriptionType({});

/** Narrows `context.user` inside resolvers guarded by the `loggedIn` scope. */
export function currentUser(context: Context): User {
  if (!context.user) throw new AppError("NOT_AUTHENTICATED");
  return context.user;
}

export const loggedIn = { loggedIn: true } as const;
export const staff = { staff: true } as const;
