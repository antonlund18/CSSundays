import { env } from "../env.js";

type Email = { to: string; subject: string; text: string };

/** Sent mail in tests and when no provider is configured (also printed to the console). */
export const outbox: Email[] = [];

export async function sendEmail(email: Email): Promise<void> {
  if (!env.RESEND_API_KEY) {
    outbox.push(email);
    if (env.NODE_ENV !== "test") console.info(`\n[e-mail to ${email.to}] ${email.subject}\n${email.text}\n`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: email.to, subject: email.subject, text: email.text }),
  });
  if (!response.ok) {
    console.error("Sending e-mail failed", response.status, await response.text());
  }
}
