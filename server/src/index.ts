import { createServer } from "node:http";
import { yoga } from "./app.js";
import { prisma } from "./db.js";
import { env } from "./env.js";
import { readLocalImage } from "./lib/storage.js";
import { restoreTimers, stopTimers } from "./schema/match/match.service.js";

const server = createServer(async (req, res) => {
  const url = req.url ?? "/";

  // Health check for the host and uptime pingers. Deliberately does not touch
  // the database, so pings do not keep Neon's compute awake.
  if (url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" }).end("ok");
    return;
  }

  // Locally stored images (only used when no S3/R2 bucket is configured).
  if (url.startsWith("/uploads/") && req.method === "GET") {
    const image = await readLocalImage(url.slice("/uploads/".length).split("?")[0]);
    if (!image) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "Content-Type": image.type, "Cache-Control": "public, max-age=31536000, immutable" }).end(image.body);
    return;
  }

  return yoga(req, res);
});

const restored = await restoreTimers();
server.listen(env.PORT, () => {
  console.info(`CSSundays API on http://localhost:${env.PORT}/graphql (${restored} match timers restored)`);
});

const shutdown = () => {
  stopTimers();
  server.close(() => {
    prisma.$disconnect().finally(() => process.exit(0));
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
