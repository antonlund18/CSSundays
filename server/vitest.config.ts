import { defineConfig } from "vitest/config";

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/cssundays_test";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      NODE_ENV: "test",
      DATABASE_URL: TEST_DATABASE_URL,
      APP_ORIGINS: "http://localhost:5173",
      UPLOAD_DIR: "uploads-test",
    },
    // Tests share one database, so files run one at a time.
    fileParallelism: false,
    globalSetup: "./src/test/global-setup.ts",
    setupFiles: ["./src/test/setup.ts"],
    testTimeout: 30_000,
    hookTimeout: 120_000,
  },
});
