-- Every match now gets its own DatHost server, so there is no queue for a shared pool.
UPDATE "matches" SET "server_status" = NULL WHERE "server_status" = 'QUEUED';
ALTER TYPE "ServerStatus" RENAME VALUE 'QUEUED' TO 'STARTING';
