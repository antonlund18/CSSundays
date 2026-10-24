-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ORGANIZER', 'USER');

-- CreateEnum
CREATE TYPE "AuthTokenKind" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INVITE_TO_TEAM');

-- CreateEnum
CREATE TYPE "TournamentFormat" AS ENUM ('SINGLE_ELIMINATION');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('OPEN_FOR_REGISTRATIONS', 'CLOSED_FOR_REGISTRATIONS', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "MatchPhase" AS ENUM ('WAITING_FOR_TEAMS', 'WAITING_TO_START', 'READY_CHECK', 'PICK_AND_BAN', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "password_hash" TEXT NOT NULL,
    "playertag" TEXT NOT NULL,
    "playertag_key" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "avatar_path" TEXT,
    "steam_id" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_tokens" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "kind" "AuthTokenKind" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_key" TEXT NOT NULL,
    "avatar_path" TEXT,
    "owner_id" UUID NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "team_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("team_id","user_id")
);

-- CreateTable
CREATE TABLE "team_invites" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "sender_id" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),

    CONSTRAINT "team_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "recipient_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "invite_id" INTEGER,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "picture_path" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "rules" TEXT NOT NULL DEFAULT '',
    "format" "TournamentFormat" NOT NULL DEFAULT 'SINGLE_ELIMINATION',
    "starts_at" TIMESTAMP(3) NOT NULL,
    "max_teams" INTEGER NOT NULL,
    "status" "TournamentStatus" NOT NULL DEFAULT 'OPEN_FOR_REGISTRATIONS',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_registrations" (
    "id" SERIAL NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "captain_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_players" (
    "registration_id" INTEGER NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registration_players_pkey" PRIMARY KEY ("registration_id","user_id")
);

-- CreateTable
CREATE TABLE "maps" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "maps_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "registration1_id" INTEGER,
    "registration2_id" INTEGER,
    "phase" "MatchPhase" NOT NULL DEFAULT 'WAITING_FOR_TEAMS',
    "phase_started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phase_ends_at" TIMESTAMP(3),
    "team1_ready" BOOLEAN NOT NULL DEFAULT false,
    "team2_ready" BOOLEAN NOT NULL DEFAULT false,
    "first_ban_team" INTEGER,
    "map" TEXT,
    "winner" INTEGER,
    "server_address" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_bans" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "map" TEXT NOT NULL,
    "team" INTEGER NOT NULL,
    "banned_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_bans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_chat_messages" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "sender_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_playertag_key_key" ON "users"("playertag_key");

-- CreateIndex
CREATE UNIQUE INDEX "users_steam_id_key" ON "users"("steam_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "auth_tokens_user_id_idx" ON "auth_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key_key" ON "teams"("name_key");

-- CreateIndex
CREATE INDEX "teams_owner_id_idx" ON "teams"("owner_id");

-- CreateIndex
CREATE INDEX "team_members_user_id_idx" ON "team_members"("user_id");

-- CreateIndex
CREATE INDEX "team_invites_recipient_id_idx" ON "team_invites"("recipient_id");

-- CreateIndex
CREATE INDEX "notifications_recipient_id_created_at_idx" ON "notifications"("recipient_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_registrations_tournament_id_team_id_key" ON "tournament_registrations"("tournament_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "registration_players_tournament_id_user_id_key" ON "registration_players"("tournament_id", "user_id");

-- CreateIndex
CREATE INDEX "matches_phase_ends_at_idx" ON "matches"("phase_ends_at");

-- CreateIndex
CREATE UNIQUE INDEX "matches_tournament_id_position_key" ON "matches"("tournament_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "match_bans_match_id_ordinal_key" ON "match_bans"("match_id", "ordinal");

-- CreateIndex
CREATE UNIQUE INDEX "match_bans_match_id_map_key" ON "match_bans"("match_id", "map");

-- CreateIndex
CREATE INDEX "match_chat_messages_match_id_created_at_idx" ON "match_chat_messages"("match_id", "created_at");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_invite_id_fkey" FOREIGN KEY ("invite_id") REFERENCES "team_invites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_captain_id_fkey" FOREIGN KEY ("captain_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_players" ADD CONSTRAINT "registration_players_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "tournament_registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_players" ADD CONSTRAINT "registration_players_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_players" ADD CONSTRAINT "registration_players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_registration1_id_fkey" FOREIGN KEY ("registration1_id") REFERENCES "tournament_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_registration2_id_fkey" FOREIGN KEY ("registration2_id") REFERENCES "tournament_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_map_fkey" FOREIGN KEY ("map") REFERENCES "maps"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_bans" ADD CONSTRAINT "match_bans_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_bans" ADD CONSTRAINT "match_bans_map_fkey" FOREIGN KEY ("map") REFERENCES "maps"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_bans" ADD CONSTRAINT "match_bans_banned_by_fkey" FOREIGN KEY ("banned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_chat_messages" ADD CONSTRAINT "match_chat_messages_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_chat_messages" ADD CONSTRAINT "match_chat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Added by hand: rules Prisma's schema language cannot express.
-- ---------------------------------------------------------------------------

-- At most one pending invite per team and player.
CREATE UNIQUE INDEX "team_invites_one_pending_idx" ON "team_invites"("team_id", "recipient_id") WHERE "status" = 'PENDING';

ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_max_teams_power_of_two"
  CHECK ("max_teams" BETWEEN 2 AND 1024 AND ("max_teams" & ("max_teams" - 1)) = 0);
ALTER TABLE "matches" ADD CONSTRAINT "matches_first_ban_team_check" CHECK ("first_ban_team" IN (1, 2));
ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_check" CHECK ("winner" IN (1, 2));
ALTER TABLE "match_bans" ADD CONSTRAINT "match_bans_team_check" CHECK ("team" IN (1, 2));
ALTER TABLE "match_chat_messages" ADD CONSTRAINT "match_chat_messages_length"
  CHECK (char_length("message") BETWEEN 1 AND 256);

-- Initial CS2 map pool (managed at /admin/maps afterwards).
INSERT INTO "maps" ("slug", "name", "image_url", "sort_order") VALUES
  ('mirage', 'Mirage', 'https://tradeit.gg/blog/wp-content/uploads/2023/07/image-18.webp', 1),
  ('ancient', 'Ancient', 'https://tradeit.gg/blog/wp-content/uploads/2023/07/image-21-1024x576.webp', 2),
  ('anubis', 'Anubis', 'https://tradeit.gg/blog/wp-content/uploads/2023/07/image-27-1024x576.webp', 3),
  ('nuke', 'Nuke', 'https://tradeit.gg/blog/wp-content/uploads/2023/07/image-20-1024x576.webp', 4),
  ('overpass', 'Overpass', 'https://tradeit.gg/blog/wp-content/uploads/2023/07/image-23.webp', 5),
  ('vertigo', 'Vertigo', 'https://tradeit.gg/blog/wp-content/uploads/2023/07/image-19-1024x576.webp', 6),
  ('inferno', 'Inferno', 'https://tradeit.gg/blog/wp-content/uploads/2023/07/image-22.webp', 7);
