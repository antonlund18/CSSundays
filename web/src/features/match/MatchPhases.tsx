import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { Check, Copy, LoaderCircle, Play, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import { banMap, mapsQuery, markReady, type MatchDetails, type MatchSide } from "@/api/matches";
import { useAuth } from "@/auth/AuthProvider";
import { PlayerTile, StoredImage } from "@/components/avatars";
import { Button } from "@/components/ui/button";
import { banTurn } from "@/lib/bracket";
import { errorMessage } from "@/lib/errors";
import { formatCountdown } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCountdown } from "./useCountdown";

/** Who is looking at the match and how their actions are sent. The admin sandbox swaps in a simulation. */
export type MatchActions = {
  userId: string | null;
  isStaff: boolean;
  markReady: (matchId: number) => Promise<void>;
  banMap: (matchId: number, map: string) => Promise<void>;
};

export const MatchActionsContext = createContext<MatchActions | null>(null);

function useMatchActions(): MatchActions {
  const { userId, isStaff } = useAuth();
  return useContext(MatchActionsContext) ?? { userId, isStaff, markReady, banMap };
}

function captainOf(side: MatchSide | null) {
  return side?.players.find((player) => player.id === side.captainId) ?? null;
}

function Centered({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
      <p className="heading text-3xl sm:text-4xl">{title}</p>
      {children}
    </div>
  );
}

function ReadyCheck({ match }: { match: MatchDetails }) {
  const { userId, markReady } = useMatchActions();
  const remaining = useCountdown(match.phaseEndsAt);
  const ready = useMutation({
    mutationFn: () => markReady(match.id),
    onError: (error) => toast.error(errorMessage(error)),
  });
  const captains = [
    { captain: captainOf(match.registration1), isReady: match.team1Ready, side: 1 },
    { captain: captainOf(match.registration2), isReady: match.team2Ready, side: 2 },
  ];
  const mine = captains.find(({ captain }) => captain && captain.id === userId);

  return (
    <div className="grid min-h-64 items-center gap-6 sm:grid-cols-3">
      {captains.map(({ captain, isReady, side }) => (
        <div key={side} className={cn("flex items-center justify-center gap-4", side === 2 && "sm:order-3 sm:flex-row-reverse")}>
          {captain && <PlayerTile player={captain} className="w-24" />}
          {isReady ? <Check className="size-12 text-success" /> : <LoaderCircle className="size-10 animate-spin text-muted" />}
        </div>
      ))}
      <div className="text-center sm:order-2">
        <p className="heading text-xl">Venter på at holdene bliver klar</p>
        {remaining !== null && <p className="heading mt-2 text-4xl text-primary tabular-nums">{formatCountdown(remaining)}</p>}
        {mine && !mine.isReady && (
          <Button size="lg" className="mt-4" disabled={ready.isPending} onClick={() => ready.mutate()}>
            Klar
          </Button>
        )}
      </div>
    </div>
  );
}

function PickAndBan({ match }: { match: MatchDetails }) {
  const { userId, banMap } = useMatchActions();
  const { data: maps = [] } = useQuery(mapsQuery());
  const remaining = useCountdown(match.phaseEndsAt);
  const ban = useMutation({
    mutationFn: (map: string) => banMap(match.id, map),
    onError: (error) => toast.error(errorMessage(error)),
  });

  const turn = banTurn(match.firstBanTeam ?? 1, match.bans.length);
  const turnCaptain = captainOf(turn === 1 ? match.registration1 : match.registration2);
  const myTurn = !!turnCaptain && turnCaptain.id === userId;
  const banned = new Map(match.bans.map((entry) => [entry.mapSlug, entry]));
  const pool = maps.filter((map) => map.active || banned.has(map.slug));
  // Bans that were already made when the page loaded appear without the animation.
  const [initialBans] = useState(() => new Set(match.bans.map((entry) => entry.mapSlug)));

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <p className="heading text-lg">
          <span className={turn === 1 ? "text-primary" : "text-accent-light"}>{turnCaptain?.playertag ?? `Hold ${turn}`}</span> skal banne et kort
        </p>
        {remaining !== null && <p className="heading text-3xl tabular-nums">{formatCountdown(remaining)}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {pool.map((map) => {
          const entry = banned.get(map.slug);
          const fresh = !!entry && !initialBans.has(map.slug);
          return (
            <button
              key={map.slug}
              disabled={!myTurn || !!entry || ban.isPending}
              onClick={() => ban.mutate(map.slug)}
              className={cn(
                "group relative aspect-[3/4] overflow-hidden rounded-lg border-2 bg-surface-3 bg-cover bg-center transition duration-500",
                entry ? "border-transparent grayscale" : "border-white/10",
                myTurn && !entry && "cursor-pointer hover:scale-[1.03] hover:border-accent",
                fresh && "delay-300 motion-safe:animate-ban-impact",
              )}
              style={map.imageUrl ? { backgroundImage: `url(${map.imageUrl})` } : undefined}
            >
              <span
                className={cn(
                  "absolute inset-0 transition duration-500",
                  entry ? "bg-black/75" : "bg-black/25 group-hover:bg-black/10",
                  fresh && "delay-300",
                )}
              />
              <span className="heading absolute inset-x-0 bottom-3 text-center text-lg text-white drop-shadow-[0_0_8px_black]">{map.name}</span>
              {entry && (
                <>
                  <span
                    className={cn(
                      "absolute inset-x-[-40%] top-1/2 -mt-0.75 h-1.5 rotate-[-55deg] rounded-full",
                      entry.team === 1 ? "bg-primary shadow-[0_0_16px_var(--color-primary)]" : "bg-accent shadow-[0_0_16px_var(--color-accent)]",
                      fresh && "motion-safe:animate-ban-slash",
                    )}
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={cn(
                        "flex size-16 -rotate-12 items-center justify-center rounded-full border-4 bg-black/40",
                        entry.team === 1 ? "border-primary text-primary" : "border-accent text-accent-light",
                        fresh && "motion-safe:animate-ban-stamp",
                      )}
                    >
                      <X className="size-10" strokeWidth={3} />
                    </span>
                  </span>
                  {fresh && <span className="pointer-events-none absolute inset-0 bg-white opacity-0 motion-safe:animate-ban-flash" />}
                  <span
                    className={cn(
                      "heading absolute top-2 left-1/2 -translate-x-1/2 rounded px-2 py-0.5 text-[10px]",
                      entry.team === 1 ? "bg-primary/80" : "bg-accent/80",
                    )}
                  >
                    {entry.automatic ? "Auto-ban" : "Bannet"}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
      <div className={'text-center'}>
        {myTurn && <p className="mt-1 text-sm text-muted">Det er din tur – klik på et kort for at banne det.</p>}
      </div>
    </div>
  );
}

function InProgress({ match, isParticipant }: { match: MatchDetails; isParticipant: boolean }) {
  const { isStaff } = useMatchActions();
  const { data: maps = [] } = useQuery(mapsQuery());
  const map = maps.find((entry) => entry.slug === match.mapSlug);
  // The API only returns the address to the two teams and staff.
  const address = match.serverAddress;

  const copy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(`connect ${address}`);
    toast.info("Connect-kommando kopieret til udklipsholderen");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-4 text-center">
      <p className="heading text-2xl">Kamp i gang</p>
      <div
        className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-white/10 bg-surface-3 bg-cover bg-center motion-safe:animate-map-reveal"
        style={map?.imageUrl ? { backgroundImage: `url(${map.imageUrl})` } : undefined}
      >
        <span className="heading absolute inset-x-0 bottom-0 bg-black/60 py-2 text-lg">{map?.name ?? match.mapSlug}</span>
      </div>
      {isParticipant || isStaff ? (
        address ? (
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 font-mono text-sm">
              <span className="flex-1 truncate text-left">connect {address}</span>
              <Button variant="ghost" size="icon" className="size-8" onClick={copy} aria-label="Kopiér">
                <Copy />
              </Button>
            </div>
            <Button asChild size="lg">
              <a href={`steam://connect/${address}`}>
                <Play /> Join kamp
              </a>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted">Serveren er ved at blive klargjort. IP-adressen vises her.</p>
        )
      ) : (
        <p className="text-sm text-muted">Server-IP vises kun for holdene i kampen.</p>
      )}
    </div>
  );
}

function Finished({ match }: { match: MatchDetails }) {
  const winner = match.winner === 1 ? match.registration1 : match.registration2;
  return (
    <Centered title="Kamp overstået">
      <Trophy className="size-10 text-warning" />
      {winner && (
        <>
          <StoredImage src={winner.team.avatarUrl} fallback="team" alt="" className="size-32" />
          <p className={cn("heading text-xl", match.winner === 1 ? "text-primary" : "text-accent-light")}>{winner.team.name}</p>
        </>
      )}
    </Centered>
  );
}

export function MatchPhase({ match, isParticipant }: { match: MatchDetails; isParticipant: boolean }) {
  switch (match.phase) {
    case "WAITING_FOR_TEAMS":
      return <Centered title="Venter på hold" />;
    case "WAITING_TO_START":
      return <Centered title="Venter på at starte" />;
    case "CANCELLED":
      return <Centered title="Kamp aflyst" />;
    case "READY_CHECK":
      return <ReadyCheck match={match} />;
    case "PICK_AND_BAN":
      return <PickAndBan match={match} />;
    case "IN_PROGRESS":
      return <InProgress match={match} isParticipant={isParticipant} />;
    case "FINISHED":
      return <Finished match={match} />;
  }
}
