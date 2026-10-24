// Steam OpenID 2.0: the browser is sent to Steam and comes back to
// <site>/steam/callback with signed openid.* parameters. We ask Steam to confirm
// the signature (check_authentication) before storing the SteamID64.

import { prisma } from "../../db.js";
import { env } from "../../env.js";
import type { User } from "../../generated/prisma/client.js";
import { fail, isUniqueViolation } from "../../lib/errors.js";

const STEAM_ENDPOINT = "https://steamcommunity.com/openid/login";
const CLAIMED_ID = /^https:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/;
const MAX_NONCE_AGE_MS = 5 * 60 * 1000;

function nonceIsFresh(nonce: string | undefined): boolean {
  // Format: 2026-10-23T12:00:00Z<random>
  const timestamp = nonce?.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/)?.[1];
  if (!timestamp) return false;
  const age = Date.now() - Date.parse(timestamp);
  return age >= -60_000 && age <= MAX_NONCE_AGE_MS;
}

function returnOrigin(returnTo: string | undefined): string | null {
  try {
    return new URL(returnTo ?? "").origin;
  } catch {
    return null;
  }
}

export type SteamVerifier = (params: Record<string, string>) => Promise<boolean>;

/** Asks Steam whether the assertion is genuine. */
export const verifyWithSteam: SteamVerifier = async (params) => {
  const response = await fetch(STEAM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...params, "openid.mode": "check_authentication" }),
  });
  if (!response.ok) return false;
  return /^is_valid\s*:\s*true\s*$/m.test(await response.text());
};

export async function linkSteam(user: User, rawParams: Record<string, unknown>, verifier: SteamVerifier = verifyWithSteam) {
  const params = Object.fromEntries(
    Object.entries(rawParams).filter(
      (entry): entry is [string, string] => entry[0].startsWith("openid.") && typeof entry[1] === "string",
    ),
  );
  const steamId = params["openid.claimed_id"]?.match(CLAIMED_ID)?.[1];
  const origin = returnOrigin(params["openid.return_to"]);

  if (
    params["openid.mode"] !== "id_res" ||
    params["openid.op_endpoint"] !== STEAM_ENDPOINT ||
    !steamId ||
    params["openid.identity"] !== params["openid.claimed_id"] ||
    !origin ||
    !env.APP_ORIGINS.includes(origin) ||
    !nonceIsFresh(params["openid.response_nonce"]) ||
    !(await verifier(params))
  ) {
    fail("STEAM_VERIFICATION_FAILED");
  }

  try {
    return await prisma.user.update({ where: { id: user.id }, data: { steamId } });
  } catch (error) {
    if (isUniqueViolation(error)) fail("STEAM_ALREADY_LINKED");
    throw error;
  }
}

export async function unlinkSteam(user: User) {
  return prisma.user.update({ where: { id: user.id }, data: { steamId: null } });
}
