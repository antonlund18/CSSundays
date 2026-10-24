import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Play, Swords } from "lucide-react";
import { Popover } from "radix-ui";
import { useState } from "react";
import {
  MyActivityChangedSubscription,
  activityQuery,
  activityStatus,
  opponentOf,
  type ActiveRegistration,
} from "@/api/activity";
import { useAuth } from "@/auth/AuthProvider";
import { StoredImage } from "@/components/avatars";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/features/match/useCountdown";
import { formatCountdown } from "@/lib/format";
import { useLiveInvalidate } from "@/lib/graphql";
import { cn } from "@/lib/utils";

function useActivity() {
  const { userId } = useAuth();
  const { data = [] } = useQuery({ ...activityQuery(userId ?? ""), enabled: !!userId });
  const actions = userId ? data.filter((registration) => activityStatus(registration, userId).action).length : 0;
  return { userId, registrations: userId ? data : [], actions };
}

function Countdown({ endsAt }: { endsAt: string | null }) {
  const remaining = useCountdown(endsAt);
  if (remaining === null) return null;
  return <span className="tabular-nums">{formatCountdown(remaining)}</span>;
}

function ActivityCard({ registration, userId, onNavigate }: { registration: ActiveRegistration; userId: string; onNavigate?: () => void }) {
  const status = activityStatus(registration, userId);
  const match = registration.currentMatch;
  const opponent = opponentOf(registration);
  const { tournament } = registration;
  // The whole card is clickable through the link's ::after overlay; the join button sits above it.
  const linkClass = "after:absolute after:inset-0 after:rounded-xl";

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-surface-2/60 p-3 transition-colors hover:bg-surface-2",
        status.action ? "border-accent shadow-[0_0_16px] shadow-accent/30" : "border-border",
      )}
    >
      <div className="flex items-center gap-2">
        <StoredImage src={tournament.pictureUrl} fallback="tournament" alt="" className="size-6" />
        <span className="heading truncate text-[11px] text-muted">{tournament.name}</span>
      </div>

      {match ? (
        <Link to="/matches/$matchId" params={{ matchId: String(match.id) }} onClick={onNavigate} className={cn("mt-2 flex items-center gap-2", linkClass)}>
          <span className="text-xs text-muted">vs</span>
          <StoredImage src={opponent?.team.avatarUrl} fallback="team" alt="" className="size-6" />
          <span className="truncate text-sm font-bold">{opponent?.team.name ?? "TBD"}</span>
        </Link>
      ) : (
        <Link
          to="/tournaments/$tournamentId"
          params={{ tournamentId: String(tournament.id) }}
          onClick={onNavigate}
          className={cn("mt-2 block truncate text-sm font-bold", linkClass)}
        >
          Til turneringen
        </Link>
      )}

      <div className={cn("mt-2 flex items-center gap-2 text-xs", status.action ? "font-bold text-white" : "text-muted")}>
        {status.action && (
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
        )}
        <span className="min-w-0 flex-1">{status.text}</span>
        <Countdown endsAt={status.endsAt} />
      </div>

      {status.connect && (
        <Button asChild size="sm" variant="accent" className="relative z-10 mt-3 w-full">
          <a href={`steam://connect/${status.connect}`}>
            <Play /> Join kamp
          </a>
        </Button>
      )}
    </div>
  );
}

function ActivityList({ onNavigate }: { onNavigate?: () => void }) {
  const { userId, registrations } = useActivity();
  if (!userId) return null;
  return (
    <div className="flex flex-col gap-3">
      {registrations.map((registration) => (
        <ActivityCard key={registration.id} registration={registration} userId={userId} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

/**
 * The player's active tournaments and what they need to do in them. Shown as
 * a rail on large screens; smaller screens use <ActivityButton> in the navbar.
 * Always mounted while logged in because it owns the live subscription.
 */
export function ActivitySidebar() {
  const { userId, registrations } = useActivity();
  useLiveInvalidate(MyActivityChangedSubscription, {}, [["activity"]], !!userId);

  if (registrations.length === 0) return null;
  
  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-white/5 bg-background/60 p-4 backdrop-blur-lg lg:block">
      <h2 className="heading mb-3 text-xs text-muted">Mine turneringer</h2>
      <ActivityList />
    </aside>
  );
}

export function ActivityButton() {
  const { registrations, actions } = useActivity();
  const [open, setOpen] = useState(false);
  if (registrations.length === 0) return null;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="icon" className="relative lg:hidden" aria-label={`Mine turneringer (${actions} kræver handling)`}>
          <Swords className="size-5!" />
          {actions > 0 && (
            <span className="absolute top-0.5 right-0.5 flex min-w-4 animate-pulse items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-4 font-bold text-white">
              {actions}
            </span>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 max-h-[70vh] w-80 overflow-y-auto rounded-xl border border-border bg-surface p-3 shadow-2xl shadow-black/50 data-[state=open]:animate-fade-in"
        >
          <div className="heading mb-3 text-xs text-muted">Mine turneringer</div>
          <ActivityList onNavigate={() => setOpen(false)} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
