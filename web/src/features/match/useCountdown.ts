import { useEffect, useState } from "react";

/** Seconds left until `endsAt`, or null when there is no deadline. */
export function useCountdown(endsAt: string | null): number | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAt) return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [endsAt]);

  return endsAt ? Math.max(0, (new Date(endsAt).getTime() - now) / 1000) : null;
}
