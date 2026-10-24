import { z } from "zod";

const optional = z
  .string()
  .optional()
  .transform((value) => (value ? value : undefined));

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().default(4000),
  /** Frontend origin(s): CORS, links in e-mails and allowed Steam return URLs. */
  APP_ORIGINS: z
    .string()
    .default("http://localhost:5173")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean),
    ),
  RESEND_API_KEY: optional,
  EMAIL_FROM: z.string().default("CSSundays <noreply@cssundays.dk>"),
  REQUIRE_EMAIL_VERIFICATION: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
  S3_ENDPOINT: optional,
  S3_REGION: z.string().default("auto"),
  S3_BUCKET: optional,
  S3_ACCESS_KEY_ID: optional,
  S3_SECRET_ACCESS_KEY: optional,
  IMAGE_BASE_URL: optional,
  UPLOAD_DIR: z.string().default("uploads"),
  /** Public URL of this API, used for locally stored images. */
  PUBLIC_API_URL: optional,
});

export const env = schema.parse(process.env);

/** The first configured frontend origin is used in e-mail links. */
export const appUrl = env.APP_ORIGINS[0];
