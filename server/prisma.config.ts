import { defineConfig, env } from "prisma/config";

// Prisma 7 does not read .env by itself; production sets real environment variables instead.
try {
  process.loadEnvFile(".env");
} catch {
  // No .env file.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a direct connection (Neon's pooler runs PgBouncer); the app itself uses DATABASE_URL.
    url: process.env.DIRECT_DATABASE_URL || env("DATABASE_URL"),
  },
});
