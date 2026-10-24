import { createYoga } from "graphql-yoga";
import { env } from "./env.js";
import { schema } from "./schema/index.js";
import type { Context } from "./schema/builder.js";
import { userFromSessionToken } from "./schema/auth/auth.service.js";

function bearerToken(request: Request): string | null {
  return request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1] ?? null;
}

export const yoga = createYoga<Record<string, unknown>, Context>({
  schema,
  graphqlEndpoint: "/graphql",
  // Unexpected errors are masked; AppErrors (with codes for the UI) pass through.
  maskedErrors: env.NODE_ENV === "production",
  graphiql: env.NODE_ENV !== "production",
  landingPage: false,
  logging: "warn",
  cors: {
    origin: env.APP_ORIGINS,
    credentials: false,
    allowedHeaders: ["authorization", "content-type", "graphql-preflight", "x-graphql-yoga-csrf"],
    methods: ["GET", "POST", "OPTIONS"],
  },
  context: async ({ request }) => {
    const token = bearerToken(request);
    return { token, user: await userFromSessionToken(token) };
  },
});
