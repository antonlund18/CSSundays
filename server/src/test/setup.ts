import { afterAll, beforeAll } from "vitest";
import { prisma } from "../db.js";
import { stopTimers } from "../schema/match/match.service.js";

// Each test file starts from an empty database (the map pool from the migration is kept).
beforeAll(async () => {
  await prisma.$executeRawUnsafe(`
    TRUNCATE users, sessions, auth_tokens, teams, team_members, team_invites, notifications,
      tournaments, tournament_registrations, registration_players, matches, match_bans,
      match_chat_messages RESTART IDENTITY CASCADE
  `);
  await prisma.gameMap.updateMany({ data: { active: true } });
});

afterAll(async () => {
  stopTimers();
  await prisma.$disconnect();
});
