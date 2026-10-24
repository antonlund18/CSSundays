const pad = (value: number) => value.toString().padStart(2, "0");

/** 2026-10-23 */
export function formatDate(value: string | Date): string {
  const date = new Date(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 14:05 */
export function formatTime(value: string | Date): string {
  const date = new Date(value);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** 2026-10-23 14:05 */
export function formatDateTime(value: string | Date): string {
  return `${formatDate(value)} ${formatTime(value)}`;
}

/** 23. oktober 2026 kl. 14:05 */
export function formatLongDateTime(value: string | Date): string {
  const date = new Date(value);
  const day = date.toLocaleDateString("da-DK", { year: "numeric", month: "long", day: "numeric" });
  return `${day} kl. ${formatTime(date)}`;
}

const units = [
  { seconds: 31536000, one: "år", many: "år" },
  { seconds: 2592000, one: "måned", many: "måneder" },
  { seconds: 604800, one: "uge", many: "uger" },
  { seconds: 86400, one: "dag", many: "dage" },
  { seconds: 3600, one: "time", many: "timer" },
  { seconds: 60, one: "minut", many: "minutter" },
  { seconds: 1, one: "sekund", many: "sekunder" },
];

/** "3 dage siden" */
export function formatRelative(value: string | Date, now: Date = new Date()): string {
  const elapsed = Math.max(0, Math.floor((now.getTime() - new Date(value).getTime()) / 1000));
  for (const unit of units) {
    const amount = Math.floor(elapsed / unit.seconds);
    if (amount >= 1) return `${amount} ${amount === 1 ? unit.one : unit.many} siden`;
  }
  return "lige nu";
}

/** mm:ss */
export function formatCountdown(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
}

export function winrate(wins: number, losses: number): string {
  const played = wins + losses;
  if (played === 0) return "0%";
  return `${Math.round((wins / played) * 100)}%`;
}
