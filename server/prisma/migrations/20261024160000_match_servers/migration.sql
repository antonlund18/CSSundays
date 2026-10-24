-- CreateEnum
CREATE TYPE "ServerStatus" AS ENUM ('QUEUED', 'ACTIVE', 'FAILED', 'ENDED');

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "dathost_match_id" TEXT,
ADD COLUMN     "game_server_id" TEXT,
ADD COLUMN     "score1" INTEGER,
ADD COLUMN     "score2" INTEGER,
ADD COLUMN     "server_status" "ServerStatus";

-- CreateIndex
CREATE UNIQUE INDEX "matches_dathost_match_id_key" ON "matches"("dathost_match_id");

