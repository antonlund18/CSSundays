import { createServer, type IncomingMessage } from "node:http";
import { yoga } from "./app.js";
import { prisma } from "./db.js";
import { env } from "./env.js";
import { readLocalImage } from "./lib/storage.js";
import { restoreTimers, stopTimers } from "./schema/match/match.service.js";
import { datHostConfig } from "./schema/match-server/dathost.client.js";
import { reconcileMatchServers, startResultPolling } from "./schema/match-server/match-server.service.js";
import { handleDatHostWebhook } from "./schema/match-server/match-server.webhook.js";

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

  // Round and match results from DatHost's game servers.
  if (url === "/webhooks/dathost" && req.method === "POST") {
    const body = await readBody(req);
    const status = body === null ? 413 : await handleDatHostWebhook(req.headers.authorization, body);
    res.writeHead(status).end();
    return;
  }

  return yoga(req, res);
});

const MAX_WEBHOOK_BYTES = 1024 * 1024;

async function readBody(req: IncomingMessage): Promise<string | null> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_WEBHOOK_BYTES) return null;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

const restored = await restoreTimers();
let stopPolling = () => {};
server.listen(env.PORT, () => {
  console.info(`CSSundays API on http://localhost:${env.PORT}/graphql (${restored} match timers restored)`);
  const dathost = datHostConfig();
  if (!dathost) {
    console.info("Match servers: entered by staff (DatHost not configured)");
  } else {
    // Without webhooks (always the case in development) results are polled.
    if (!dathost.webhook) stopPolling = startResultPolling();
    console.info(`Match servers: DatHost (${dathost.webhook ? `webhooks to ${dathost.webhook.url}` : "polling for results"})`);
    reconcileMatchServers().catch((error) => console.error("[match-server] start-up reconciliation failed", error));
  }
});

const shutdown = () => {
  stopTimers();
  stopPolling();
  server.close(() => {
    prisma.$disconnect().finally(() => process.exit(0));
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
