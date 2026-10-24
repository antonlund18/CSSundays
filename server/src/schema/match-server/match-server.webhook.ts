import { createHash, timingSafeEqual } from "node:crypto";
import { datHostConfig } from "./dathost.client.js";
import { handleDatHostUpdate } from "./match-server.service.js";

const digest = (value: string) => createHash("sha256").update(value).digest();
const sameSecret = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

/** DatHost sends the match object; accept a few shapes so a payload change does not break us. */
function matchIdFrom(body: string): string | null {
  try {
    const payload = JSON.parse(body);
    const id = payload?.id ?? payload?.match_id ?? payload?.match?.id;
    return typeof id === "string" && id ? id : null;
  } catch {
    return null;
  }
}

/** Handles POST /webhooks/dathost (round end and match end). Returns the HTTP status to send. */
export async function handleDatHostWebhook(authorization: string | undefined, body: string): Promise<number> {
  // Webhooks are ignored in development (results are polled there) and when not configured.
  const webhook = datHostConfig()?.webhook;
  if (!webhook) return 404;
  if (!sameSecret(authorization ?? "", `Bearer ${webhook.secret}`)) return 401;
  const id = matchIdFrom(body);
  if (!id) return 400;
  try {
    await handleDatHostUpdate(id);
    return 200;
  } catch (error) {
    // A non-2xx answer lets DatHost retry; start-up reconciliation is the second safety net.
    console.error(`[match-server] webhook for DatHost match ${id} failed`, error);
    return 502;
  }
}
