-- AlterTable
ALTER TABLE "maps" ADD COLUMN     "server_map" TEXT;


-- The initial pool uses short slugs for de_ maps.
UPDATE "maps" SET "server_map" = 'de_' || "slug" WHERE "server_map" IS NULL;
