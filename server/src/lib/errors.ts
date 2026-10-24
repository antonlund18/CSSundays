import { GraphQLError } from "graphql";

/**
 * Error codes the frontend translates into Danish (web/src/lib/errors.ts).
 * The code is both the message and `extensions.code`, so it survives Yoga's error masking.
 */
export type ErrorCode =
  | "NOT_AUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INVALID_INPUT"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_CONFIRMED"
  | "EMAIL_IN_USE"
  | "INVALID_EMAIL"
  | "INVALID_PASSWORD"
  | "INVALID_PLAYERTAG"
  | "PLAYERTAG_IN_USE"
  | "INVALID_TOKEN"
  | "CANNOT_DEMOTE_SELF"
  | "INVALID_TEAM_NAME"
  | "TEAM_NAME_IN_USE"
  | "OWNER_CANNOT_LEAVE"
  | "NOT_TEAM_MEMBER"
  | "ALREADY_TEAM_MEMBER"
  | "INVITE_ALREADY_PENDING"
  | "INVITE_NOT_PENDING"
  | "REGISTRATION_CLOSED"
  | "ALREADY_REGISTERED"
  | "TOURNAMENT_FULL"
  | "TEAM_FULL"
  | "NOT_REGISTERED"
  | "BRACKET_LOCKED"
  | "WRONG_PHASE"
  | "NOT_CAPTAIN"
  | "NOT_YOUR_TURN"
  | "INVALID_MAP"
  | "MAP_ALREADY_BANNED"
  | "TOURNAMENT_ALREADY_STARTED"
  | "NOT_ENOUGH_TEAMS"
  | "NO_BRACKET"
  | "INVALID_WINNER"
  | "MATCH_NOT_READY"
  | "TOURNAMENT_NOT_STARTED"
  | "INVALID_IMAGE"
  | "STEAM_VERIFICATION_FAILED"
  | "STEAM_ALREADY_LINKED"
  | "SERVERS_NOT_CONFIGURED"
  | "NO_FREE_SERVER"
  | "TEST_SERVER_RUNNING"
  | "SERVER_START_FAILED"
  | "STEAM_REQUIRED";

export class AppError extends GraphQLError {
  constructor(public readonly code: ErrorCode) {
    super(code, { extensions: { code } });
  }
}

export function fail(code: ErrorCode): never {
  throw new AppError(code);
}

/** Prisma's unique-constraint violation. */
export function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}
