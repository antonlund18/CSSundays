import { execSync } from "node:child_process";

/** Applies pending migrations to the test database; each test file then truncates the tables. */
export default function setup() {
  const url = process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/cssundays_test";
  if (!/cssundays_test|_test\b/.test(url)) throw new Error(`Refusing to reset a non-test database: ${url}`);
  execSync("npx prisma migrate deploy", {
    stdio: "pipe",
    env: { ...process.env, DATABASE_URL: url },
  });
}
