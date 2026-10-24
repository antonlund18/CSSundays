const STEAM_LOGIN = "https://steamcommunity.com/openid/login";

export const STEAM_CALLBACK_PATH = "/steam/callback";

/** Sends the browser to Steam; Steam returns to /steam/callback with signed openid.* parameters. */
export function startSteamLink() {
  const origin = window.location.origin;
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": `${origin}${STEAM_CALLBACK_PATH}`,
    "openid.realm": origin,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });
  window.location.assign(`${STEAM_LOGIN}?${params}`);
}

export function steamProfileUrl(steamId: string) {
  return `https://steamcommunity.com/profiles/${steamId}`;
}
