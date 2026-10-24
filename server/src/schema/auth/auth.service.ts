import { hash, verify } from "@node-rs/argon2";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../../db.js";
import { appUrl, env } from "../../env.js";
import type { AuthTokenKind, User } from "../../generated/prisma/client.js";
import { sendEmail } from "../../lib/email.js";
import { fail, isUniqueViolation } from "../../lib/errors.js";
import { isValidEmail, isValidPassword, isValidPlayertag } from "../../lib/validation.js";

const SESSION_DAYS = 30;
const TOKEN_HOURS: Record<AuthTokenKind, number> = { EMAIL_VERIFICATION: 48, PASSWORD_RESET: 1 };

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const newToken = () => randomBytes(32).toString("base64url");
const normaliseEmail = (email: string) => email.trim().toLowerCase();

export const isStaff = (user: User | null) => user?.role === "ADMIN" || user?.role === "ORGANIZER";

export async function hashPassword(password: string) {
  return hash(password);
}

// Used to keep login timing the same whether or not the e-mail exists.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hash(randomBytes(16).toString("hex")));

// --- Sessions -----------------------------------------------------------------

export async function createSession(userId: string): Promise<string> {
  const token = newToken();
  await prisma.session.create({
    data: { id: sha256(token), userId, expiresAt: new Date(Date.now() + SESSION_DAYS * 86_400_000) },
  });
  return token;
}

export async function userFromSessionToken(token: string | null | undefined): Promise<User | null> {
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { id: sha256(token) }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function deleteSession(token: string) {
  await prisma.session.deleteMany({ where: { id: sha256(token) } });
}

// --- One-time e-mail tokens ------------------------------------------------------

async function issueToken(userId: string, kind: AuthTokenKind): Promise<string> {
  const token = newToken();
  await prisma.$transaction([
    prisma.authToken.deleteMany({ where: { userId, kind } }),
    prisma.authToken.create({
      data: { id: sha256(token), userId, kind, expiresAt: new Date(Date.now() + TOKEN_HOURS[kind] * 3_600_000) },
    }),
  ]);
  return token;
}

async function consumeToken(token: string, kind: AuthTokenKind): Promise<string> {
  const record = await prisma.authToken.findUnique({ where: { id: sha256(token) } });
  if (!record || record.kind !== kind || record.expiresAt < new Date()) fail("INVALID_TOKEN");
  await prisma.authToken.delete({ where: { id: record.id } });
  return record.userId;
}

async function sendVerificationEmail(user: Pick<User, "id" | "email" | "playertag">) {
  const token = await issueToken(user.id, "EMAIL_VERIFICATION");
  await sendEmail({
    to: user.email,
    subject: "Bekræft din e-mail til CSSundays",
    text: `Hej ${user.playertag}!\n\nBekræft din e-mail ved at åbne linket herunder:\n${appUrl}/verify-email?token=${token}\n\nLinket udløber om 48 timer.`,
  });
}

// --- Account flows ------------------------------------------------------------------

export async function isPlayertagAvailable(playertag: string) {
  if (!isValidPlayertag(playertag)) return false;
  return !(await prisma.user.findUnique({ where: { playertagKey: playertag.toLowerCase() }, select: { id: true } }));
}

export async function signUp(input: { email: string; playertag: string; password: string }) {
  const email = normaliseEmail(input.email);
  const playertag = input.playertag.trim();
  if (!isValidEmail(email)) fail("INVALID_EMAIL");
  if (!isValidPlayertag(playertag)) fail("INVALID_PLAYERTAG");
  if (!isValidPassword(input.password)) fail("INVALID_PASSWORD");

  let user: User;
  try {
    user = await prisma.user.create({
      data: { email, playertag, playertagKey: playertag.toLowerCase(), passwordHash: await hashPassword(input.password) },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      const target = JSON.stringify((error as { meta?: unknown }).meta ?? "");
      fail(target.includes("email") ? "EMAIL_IN_USE" : "PLAYERTAG_IN_USE");
    }
    throw error;
  }

  await sendVerificationEmail(user);
  const token = env.REQUIRE_EMAIL_VERIFICATION ? null : await createSession(user.id);
  return { token, user };
}

export async function logIn(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: normaliseEmail(input.email) } });
  const valid = await verify(user?.passwordHash ?? (await getDummyHash()), input.password);
  if (!user || !valid) fail("INVALID_CREDENTIALS");
  if (env.REQUIRE_EMAIL_VERIFICATION && !user.emailVerifiedAt) fail("EMAIL_NOT_CONFIRMED");
  return { token: await createSession(user.id), user };
}

export async function verifyEmail(token: string) {
  const userId = await consumeToken(token, "EMAIL_VERIFICATION");
  return prisma.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } });
}

export async function resendVerification(email: string) {
  const user = await prisma.user.findUnique({ where: { email: normaliseEmail(email) } });
  if (user && !user.emailVerifiedAt) await sendVerificationEmail(user);
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: normaliseEmail(email) } });
  if (!user) return; // Do not reveal whether the e-mail exists.
  const token = await issueToken(user.id, "PASSWORD_RESET");
  await sendEmail({
    to: user.email,
    subject: "Nulstil dit kodeord til CSSundays",
    text: `Hej ${user.playertag}!\n\nVælg et nyt kodeord her:\n${appUrl}/reset-password?token=${token}\n\nLinket udløber om 1 time. Har du ikke bedt om det, kan du ignorere denne mail.`,
  });
}

export async function resetPassword(token: string, password: string) {
  if (!isValidPassword(password)) fail("INVALID_PASSWORD");
  const userId = await consumeToken(token, "PASSWORD_RESET");
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      // Following a link from the inbox also proves the e-mail address.
      data: { passwordHash: await hashPassword(password), emailVerifiedAt: new Date() },
    }),
    prisma.session.deleteMany({ where: { userId } }),
  ]);
}

export async function changePassword(user: User, currentPassword: string, newPassword: string, keepToken: string | null) {
  if (!(await verify(user.passwordHash, currentPassword))) fail("INVALID_CREDENTIALS");
  if (!isValidPassword(newPassword)) fail("INVALID_PASSWORD");
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(newPassword) } }),
    // Log out every other device.
    prisma.session.deleteMany({ where: { userId: user.id, NOT: keepToken ? { id: sha256(keepToken) } : undefined } }),
  ]);
}

export async function changeEmail(user: User, email: string, password: string) {
  const next = normaliseEmail(email);
  if (!isValidEmail(next)) fail("INVALID_EMAIL");
  if (!(await verify(user.passwordHash, password))) fail("INVALID_CREDENTIALS");
  if (next === user.email) return user;
  try {
    const updated = await prisma.user.update({ where: { id: user.id }, data: { email: next, emailVerifiedAt: null } });
    await sendVerificationEmail(updated);
    return updated;
  } catch (error) {
    if (isUniqueViolation(error)) fail("EMAIL_IN_USE");
    throw error;
  }
}
