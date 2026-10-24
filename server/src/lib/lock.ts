/**
 * Serialises async work per key (e.g. one match or one tournament) inside this
 * process. The API runs as a single instance, which together with database
 * transactions keeps concurrent ready-ups, bans and registrations consistent.
 */
const tails = new Map<string, Promise<unknown>>();

export async function withLock<T>(key: string, work: () => Promise<T>): Promise<T> {
  const previous = tails.get(key) ?? Promise.resolve();
  const run = previous.then(work, work);
  const tail = run.catch(() => undefined);
  tails.set(key, tail);
  try {
    return await run;
  } finally {
    if (tails.get(key) === tail) tails.delete(key);
  }
}
