import { Link } from "@tanstack/react-router";
import { Minus, Plus, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import type { BracketMatch, Registration } from "@/api/tournaments";
import { StoredImage } from "@/components/avatars";
import { Button } from "@/components/ui/button";
import { groupByRound, roundName } from "@/lib/bracket";
import { cn } from "@/lib/utils";

const MATCH_HEIGHT = 64; // two 32px team rows
const SLOT_GAP = 16;

type BracketProps = {
  matches: BracketMatch[];
  registrations: Map<number, Registration>;
  currentUserId: string | null;
};

function TeamRow({
  registration,
  result,
  isMine,
}: {
  registration: Registration | undefined;
  result: "won" | "lost" | null;
  isMine: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-8 items-center gap-2 px-2 text-xs",
        result === "won" && "bg-success/20",
        result === "lost" && "bg-danger/15 text-muted",
      )}
    >
      {registration ? (
        <>
          <StoredImage src={registration.team.avatarUrl} fallback="team" alt="" className="size-5 rounded-sm" />
          <span className={cn("truncate", isMine ? "font-bold text-primary" : "font-semibold")}>{registration.team.name}</span>
        </>
      ) : (
        <span className="font-bold text-muted italic">TBD</span>
      )}
    </div>
  );
}

function MatchCard({ match, registrations, currentUserId }: { match: BracketMatch } & Omit<BracketProps, "matches">) {
  if (match.phase === "CANCELLED") {
    return <div className="h-16 w-48 rounded-md border border-dashed border-border bg-surface-3/30" aria-label="Aflyst kamp" />;
  }

  const team1 = match.registration1Id ? registrations.get(match.registration1Id) : undefined;
  const team2 = match.registration2Id ? registrations.get(match.registration2Id) : undefined;
  const isMine = (registration?: Registration) =>
    !!currentUserId && !!registration?.players.some((player) => player.id === currentUserId);
  const result = (team: 1 | 2) => (match.phase !== "FINISHED" ? null : match.winner === team ? "won" : "lost");
  const live = match.phase === "READY_CHECK" || match.phase === "PICK_AND_BAN" || match.phase === "IN_PROGRESS";

  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: String(match.id) }}
      draggable={false}
      className={cn(
        "relative block w-48 overflow-hidden rounded-md border bg-surface-2 transition-colors hover:border-primary",
        live ? "border-accent" : "border-border",
      )}
    >
      <TeamRow registration={team1} result={result(1)} isMine={isMine(team1)} />
      <div className="h-px bg-border" />
      <TeamRow registration={team2} result={result(2)} isMine={isMine(team2)} />
      {live && <span className="absolute top-1 right-1 size-2 animate-pulse rounded-full bg-accent" title="I gang" />}
    </Link>
  );
}

/** Drag to pan, buttons to zoom. Uses CSS zoom so scrolling keeps working. */
function PanZoom({ children, toolbar }: { children: ReactNode; toolbar: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [zoom, setZoom] = useState(1);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !viewport.current) return;
    drag.current = { x: event.clientX, y: event.clientY, left: viewport.current.scrollLeft, top: viewport.current.scrollTop };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !viewport.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) viewport.current.setPointerCapture(event.pointerId);
    viewport.current.scrollLeft = drag.current.left - dx;
    viewport.current.scrollTop = drag.current.top - dy;
  };
  const stopDrag = () => {
    drag.current = null;
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex gap-1 rounded-lg border border-border bg-surface/90 p-1 backdrop-blur">
        {toolbar}
        <Button variant="ghost" size="icon" className="size-8" onClick={() => setZoom((z) => Math.min(2, z * 1.15))} aria-label="Zoom ind">
          <ZoomIn />
        </Button>
        <Button variant="ghost" size="icon" className="size-8" onClick={() => setZoom((z) => Math.max(0.4, z / 1.15))} aria-label="Zoom ud">
          <ZoomOut />
        </Button>
        <Button variant="ghost" size="icon" className="size-8" onClick={() => setZoom(1)} aria-label="Nulstil zoom">
          <RotateCcw />
        </Button>
      </div>
      <div
        ref={viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        className="max-h-[75vh] min-h-64 cursor-grab overflow-auto rounded-xl border border-border bg-background/60 select-none active:cursor-grabbing"
      >
        <div style={{ zoom }} className="w-max p-6 pt-14">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Bracket({ matches, registrations, currentUserId }: BracketProps) {
  const rounds = groupByRound(matches);
  const [hiddenRounds, setHiddenRounds] = useState(0);
  const visible = rounds.slice(hiddenRounds);
  const firstRoundSize = visible[0]?.length ?? 0;
  const columnHeight = firstRoundSize * (MATCH_HEIGHT + SLOT_GAP);

  const toolbar = (
    <div className="flex items-center gap-1 border-r border-border pr-1">
      <span className="heading hidden px-2 text-[11px] text-muted sm:inline">Runder: {visible.length}</span>
      <Button variant="ghost" size="icon" className="size-8" onClick={() => setHiddenRounds((h) => Math.max(0, h - 1))} disabled={hiddenRounds === 0} aria-label="Vis flere runder">
        <Plus />
      </Button>
      <Button variant="ghost" size="icon" className="size-8" onClick={() => setHiddenRounds((h) => Math.min(rounds.length - 1, h + 1))} disabled={visible.length <= 1} aria-label="Vis færre runder">
        <Minus />
      </Button>
    </div>
  );

  return (
    <PanZoom toolbar={toolbar}>
      <div className="flex">
        {visible.map((round, visibleIndex) => {
          const roundIndex = visibleIndex + hiddenRounds;
          const isLast = visibleIndex === visible.length - 1;
          const isFirst = visibleIndex === 0;
          return (
            <div key={roundIndex} className="flex shrink-0 flex-col">
              <p className="heading mb-3 text-center text-[11px] text-muted">{roundName(roundIndex, rounds.length)}</p>
              <div className="flex flex-col" style={{ height: columnHeight }}>
                {round.map((match, index) => (
                  <div
                    key={match.id}
                    className={cn(
                      "relative flex flex-1 items-center",
                      !isFirst && "pl-6",
                      !isLast && "pr-6",
                      // Line into this match from the previous round.
                      !isFirst && "before:absolute before:top-1/2 before:left-0 before:w-6 before:border-t before:border-border",
                      // Elbow joining each pair towards the next round.
                      !isLast &&
                        (index % 2 === 0
                          ? "after:absolute after:top-1/2 after:right-0 after:h-1/2 after:w-6 after:rounded-tr-md after:border-t after:border-r after:border-border"
                          : "after:absolute after:right-0 after:bottom-1/2 after:h-1/2 after:w-6 after:rounded-br-md after:border-r after:border-b after:border-border"),
                    )}
                  >
                    <MatchCard match={match} registrations={registrations} currentUserId={currentUserId} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PanZoom>
  );
}
