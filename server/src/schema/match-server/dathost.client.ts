import { randomBytes } from "node:crypto";
import { env } from "../../env.js";

// Thin client for the parts of the DatHost API we use.
// Docs: https://dathost.readme.io/reference/cs2-servers-rest-api

const BASE_URL = "https://dathost.net/api/0.1";
const TIMEOUT_MS = 30_000;

export type DatHostConfig = {
  email: string;
  password: string;
  location: string | null;
  /** Prefix of the names of servers this deployment creates, so it only ever cleans up its own. */
  serverPrefix: string;
  /** Null in development (and when not configured): results are then polled instead. */
  webhook: { url: string; secret: string } | null;
};

/** The DatHost settings, or null when automatic servers are switched off. */
export function datHostConfig(): DatHostConfig | null {
  const { DATHOST_EMAIL, DATHOST_PASSWORD, DATHOST_WEBHOOK_URL, DATHOST_WEBHOOK_SECRET, NODE_ENV } = env;
  if (!DATHOST_EMAIL || !DATHOST_PASSWORD) return null;
  return {
    email: DATHOST_EMAIL,
    password: DATHOST_PASSWORD,
    location: 'copenhagen',
    serverPrefix: NODE_ENV === "production" ? "cssundays" : `cssundays-${NODE_ENV}`,
    webhook:
      NODE_ENV !== "development" && DATHOST_WEBHOOK_URL && DATHOST_WEBHOOK_SECRET
        ? { url: DATHOST_WEBHOOK_URL, secret: DATHOST_WEBHOOK_SECRET }
        : null,
  };
}

export type CreateServerRequest = { name: string; location: string | null };

export type CreateMatchRequest = {
  game_server_id: string;
  team1: { name: string };
  team2: { name: string };
  players: { steam_id_64: string; team: "team1" | "team2" }[];
  settings: { map: string };
  webhooks?: { match_end_url: string; round_end_url: string; authorization_header: string };
};

/** The fields we read from a DatHost match. Everything is optional so an unexpected shape cannot crash us. */
export type DatHostMatch = {
  id: string;
  finished?: boolean;
  cancel_reason?: string | null;
  team1?: { stats?: { score?: number } };
  team2?: { stats?: { score?: number } };
};

export type DatHostGameServer = {
  id: string;
  name?: string;
  ip?: string;
  raw_ip?: string;
  ports?: { game?: number };
  on?: boolean;
  booting?: boolean;
  players_online?: number;
};

async function call<T>(method: "GET" | "POST" | "DELETE", path: string, body?: unknown): Promise<T> {
  const config = datHostConfig();
  if (!config) throw new Error("DatHost is not configured");
  const json = body !== undefined && !(body instanceof FormData);
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      authorization: `Basic ${Buffer.from(`${config.email}:${config.password}`).toString("base64")}`,
      ...(json ? { "content-type": "application/json" } : {}),
    },
    body: body === undefined ? undefined : json ? JSON.stringify(body) : (body as FormData),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`DatHost ${method} ${path} failed with ${response.status}: ${text.slice(0, 500)}`);
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    // DatHost sometimes answers with a plain-text message (e.g. a validation error) despite a 2xx status.
    throw new Error(`DatHost ${method} ${path} returned non-JSON (${response.status}): ${text.slice(0, 500)}`);
  }
}

const serverPath = (id: string) => `/game-servers/${encodeURIComponent(id)}`;

// An object (rather than loose functions) so tests can replace single calls with vi.spyOn.
export const dathost = {
  /** Creates a CS2 server; the match API boots it when a match is started on it. */
  createGameServer: ({ name, location }: CreateServerRequest) => {
    const form = new FormData();
    form.set("game", "cs2");
    form.set("name", name);
    if (location) form.set("location", location);
    // Required by DatHost; we never use RCON ourselves (the match API drives the server).
    form.set("cs2_settings.rcon", randomBytes(16).toString("hex"));
    // Safety net against paying for a server we lost track of; deleted servers don't need it.
    form.set("autostop", "true");
    form.set("autostop_minutes", "30");
    return call<DatHostGameServer>("POST", "/game-servers", form);
  },
  getGameServer: (id: string) => call<DatHostGameServer>("GET", serverPath(id)),
  listGameServers: () => call<DatHostGameServer[]>("GET", "/game-servers"),
  stopGameServer: (id: string) => call<unknown>("POST", `${serverPath(id)}/stop`),
  deleteGameServer: (id: string) => call<unknown>("DELETE", serverPath(id)),

  createMatch: (request: CreateMatchRequest) => call<DatHostMatch>("POST", "/cs2-matches", request),
  getMatch: (id: string) => call<DatHostMatch>("GET", `/cs2-matches/${encodeURIComponent(id)}`),
  cancelMatch: (id: string) => call<unknown>("POST", `/cs2-matches/${encodeURIComponent(id)}/cancel`),
};
