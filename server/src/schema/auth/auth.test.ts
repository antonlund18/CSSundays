import { describe, expect, it } from "vitest";
import { outbox } from "../../lib/email.js";
import { gql, ok, rejects } from "../../test/helpers.js";

const SIGN_UP = `mutation ($email: String!, $playertag: String!, $password: String!) {
  signUp(email: $email, playertag: $playertag, password: $password) { token user { playertag email } }
}`;
const LOG_IN = `mutation ($email: String!, $password: String!) { logIn(email: $email, password: $password) { token } }`;
const ME = `{ me { playertag emailVerified } }`;

const lastLinkToken = (path: string) => {
  const text = outbox.at(-1)?.text ?? "";
  return text.match(new RegExp(`${path}\\?token=([\\w-]+)`))?.[1];
};

describe("accounts", () => {
  it("signs up, logs in and out", async () => {
    const { signUp } = await ok<{ signUp: { token: string; user: { playertag: string; email: string } } }>(SIGN_UP, {
      email: "New@Player.dk",
      playertag: "newbie",
      password: "secret1",
    });
    expect(signUp.user.playertag).toBe("newbie");
    // E-mails are only shown to the logged-in owner, so check through the new session.
    const me = await ok<{ me: { email: string } }>(`{ me { email } }`, {}, signUp.token);
    expect(me.me.email).toBe("new@player.dk");

    const { logIn } = await ok<{ logIn: { token: string } }>(LOG_IN, { email: "new@player.dk", password: "secret1" });
    await ok(`mutation { logOut }`, {}, logIn.token);
    expect((await gql<{ me: null }>(ME, {}, logIn.token)).data!.me).toBeNull();
  });

  it("validates input and uniqueness", async () => {
    await rejects("INVALID_PLAYERTAG", SIGN_UP, { email: "a@b.dk", playertag: "no spaces", password: "secret1" });
    await rejects("INVALID_EMAIL", SIGN_UP, { email: "nope", playertag: "valid", password: "secret1" });
    await rejects("INVALID_PASSWORD", SIGN_UP, { email: "a@b.dk", playertag: "valid", password: "123" });
    await rejects("PLAYERTAG_IN_USE", SIGN_UP, { email: "other@b.dk", playertag: "NEWBIE", password: "secret1" });
    await rejects("EMAIL_IN_USE", SIGN_UP, { email: "new@player.dk", playertag: "other", password: "secret1" });
    await rejects("INVALID_CREDENTIALS", LOG_IN, { email: "new@player.dk", password: "wrong" });
    await rejects("INVALID_CREDENTIALS", LOG_IN, { email: "ghost@player.dk", password: "secret1" });

    const available = `query ($tag: String!) { playertagAvailable(playertag: $tag) }`;
    expect((await ok<{ playertagAvailable: boolean }>(available, { tag: "Newbie" })).playertagAvailable).toBe(false);
    expect((await ok<{ playertagAvailable: boolean }>(available, { tag: "fresh" })).playertagAvailable).toBe(true);
  });

  it("confirms the e-mail through the link in the welcome mail", async () => {
    await ok(SIGN_UP, { email: "confirm@player.dk", playertag: "confirmer", password: "secret1" });
    const token = lastLinkToken("verify-email");
    expect(token).toBeTruthy();
    const { verifyEmail } = await ok<{ verifyEmail: { token: string } }>(
      `mutation ($token: String!) { verifyEmail(token: $token) { token } }`,
      { token },
    );
    expect((await ok<{ me: { emailVerified: boolean } }>(ME, {}, verifyEmail.token)).me.emailVerified).toBe(true);
    await rejects("INVALID_TOKEN", `mutation ($token: String!) { verifyEmail(token: $token) { token } }`, { token });
  });

  it("resets a forgotten password and logs out every session", async () => {
    const { token: oldSession } = (await ok<{ logIn: { token: string } }>(LOG_IN, { email: "new@player.dk", password: "secret1" })).logIn;
    await ok(`mutation { requestPasswordReset(email: "new@player.dk") }`);
    const token = lastLinkToken("reset-password");
    await ok(`mutation ($token: String!) { resetPassword(token: $token, password: "brandnew1") }`, { token });
    expect((await gql<{ me: null }>(ME, {}, oldSession)).data!.me).toBeNull();
    await ok(LOG_IN, { email: "new@player.dk", password: "brandnew1" });
    // Unknown e-mails do not reveal anything.
    await ok(`mutation { requestPasswordReset(email: "ghost@player.dk") }`);
  });

  it("changes password only with the current one", async () => {
    const { token } = (await ok<{ logIn: { token: string } }>(LOG_IN, { email: "new@player.dk", password: "brandnew1" })).logIn;
    const change = `mutation ($current: String!) { changePassword(currentPassword: $current, newPassword: "another1") }`;
    await rejects("INVALID_CREDENTIALS", change, { current: "wrong" }, token);
    await ok(change, { current: "brandnew1" }, token);
    await ok(LOG_IN, { email: "new@player.dk", password: "another1" });
  });

  it("keeps e-mails private", async () => {
    const data = await ok<{ player: { email: string | null } }>(`{ player(playertag: "newbie") { email } }`);
    expect(data.player.email).toBeNull();
  });
});

