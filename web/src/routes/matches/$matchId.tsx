import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import {
  ChatMessageAddedSubscription,
  MatchChangedSubscription,
  matchQuery,
  phaseLabels,
  type MatchSide,
} from "@/api/matches";
import { bracketQuery } from "@/api/tournaments";
import { useAuth } from "@/auth/AuthProvider";
import { PlayerTile, StoredImage } from "@/components/avatars";
import { Page } from "@/components/layout";
import { Badge, PageSpinner } from "@/components/ui/misc";
import { MatchChat } from "@/features/match/MatchChat";
import { MatchPhase } from "@/features/match/MatchPhases";
import { StaffControls } from "@/features/match/StaffControls";
import { bracketSize, roundCount, roundName } from "@/lib/bracket";
import { useLiveInvalidate } from "@/lib/graphql";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/matches/$matchId")({
  loader: async ({ context, params }) => {
    const id = Number(params.matchId);
    if (!Number.isInteger(id)) throw notFound();
    const match = await context.queryClient.ensureQueryData(matchQuery(id));
    if (!match) throw notFound();
  },
  pendingComponent: PageSpinner,
  component: MatchPage,
});

function Side({ side, position }: { side: MatchSide | null; position: 1 | 2 }) {
  const right = position === 2;
  return (
    <div className={cn("flex min-w-0 flex-1 flex-col gap-4", right && "items-end text-right")}>
      {side ? (
        <Link
          to="/teams/$teamId"
          params={{ teamId: String(side.team.id) }}
          className={cn("flex min-w-0 items-center gap-4 hover:opacity-90", right && "flex-row-reverse")}
        >
          <StoredImage src={side.team.avatarUrl} fallback="team" alt="" className="size-16 border-2 border-white/10 sm:size-24" />
          <span className={cn("heading truncate text-xl sm:text-3xl", right ? "text-accent-light" : "text-primary")}>{side.team.name}</span>
        </Link>
      ) : (
        <div className={cn("flex items-center gap-4", right && "flex-row-reverse")}>
          <StoredImage src={null} fallback="team" alt="" className="size-16 sm:size-24" />
          <span className={cn("heading text-xl italic sm:text-3xl", right ? "text-accent-light" : "text-primary")}>TBD</span>
        </div>
      )}
      {side && (
        <div className={cn("flex flex-wrap gap-2", right && "justify-end")}>
          {side.players.slice(0, 5).map((user) => (
            <PlayerTile key={user.id} player={user} className="w-14 sm:w-16" highlight={user.id === side.captainId} />
          ))}
        </div>
      )}
    </div>
  );
}

function MatchPage() {
  const { matchId } = Route.useParams();
  const id = Number(matchId);
  const { userId, isStaff } = useAuth();
  const { data: match } = useQuery(matchQuery(id));
  const { data: bracket } = useQuery({ ...bracketQuery(match?.tournamentId ?? 0), enabled: !!match });

  useLiveInvalidate(MatchChangedSubscription, { matchId: id }, [["match", id]]);
  useLiveInvalidate(ChatMessageAddedSubscription, { matchId: id }, [["chat", id]]);

  if (!match) return <PageSpinner />;

  const isParticipant =
    !!userId &&
    [match.registration1, match.registration2].some((side) => side?.players.some((user) => user.id === userId));

  const size = bracket?.length ? bracketSize(bracket) : null;
  const round = size ? roundName(roundCount(size) - 1 - Math.floor(Math.log2(match.position)), roundCount(size)) : null;

  return (
    <Page>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-sm">
        {match.tournament && (
          <Link
            to="/tournaments/$tournamentId"
            params={{ tournamentId: String(match.tournament.id) }}
            search={{ tab: "bracket" }}
            className="inline-flex items-center gap-1 text-muted hover:text-primary"
          >
            <ChevronLeft className="size-4" /> {match.tournament.name}
            {round && <span className="text-muted/70"> · {round}</span>}
          </Link>
        )}
        <Badge tone={match.phase === "FINISHED" ? "neutral" : match.phase === "CANCELLED" ? "danger" : "primary"}>{phaseLabels[match.phase]}</Badge>
      </div>

      <div className="flex items-start gap-3 sm:gap-6">
        <Side side={match.registration1} position={1} />
        <span className="heading self-center text-2xl text-muted sm:text-4xl">VS</span>
        <Side side={match.registration2} position={2} />
      </div>

      <div className="my-8 border-y border-border py-6">
        <MatchPhase match={match} isParticipant={isParticipant} />
      </div>

      {isStaff && (
        <div className="mb-8">
          <StaffControls match={match} />
        </div>
      )}

      <MatchChat match={match} canChat={isParticipant || isStaff} />
    </Page>
  );
}
