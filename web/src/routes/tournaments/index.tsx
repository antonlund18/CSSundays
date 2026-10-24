import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { statusLabels, tournamentsQuery, type TournamentListItem } from "@/api/tournaments";
import { StoredImage } from "@/components/avatars";
import { Page, PageTitle } from "@/components/layout";
import { Badge, EmptyState, PageSpinner } from "@/components/ui/misc";
import { formatLongDateTime } from "@/lib/format";

export const Route = createFileRoute("/tournaments/")({
  component: TournamentsPage,
});

const statusTone = {
  OPEN_FOR_REGISTRATIONS: "success",
  CLOSED_FOR_REGISTRATIONS: "warning",
  IN_PROGRESS: "accent",
  FINISHED: "neutral",
} as const;

function TournamentRow({ tournament }: { tournament: TournamentListItem }) {
  const registered = tournament.registrationCount;
  return (
    <Link
      to="/tournaments/$tournamentId"
      params={{ tournamentId: String(tournament.id) }}
      className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-surface-2/70 sm:gap-6"
    >
      <StoredImage src={tournament.pictureUrl} fallback="tournament" alt="" className="aspect-video w-28 sm:w-56" />
      <div className="min-w-0 flex-1">
        <p className="heading text-xs text-primary">{formatLongDateTime(tournament.startsAt)}</p>
        <p className="heading truncate text-lg sm:text-2xl">{tournament.name}</p>
        <Badge tone={statusTone[tournament.status]} className="mt-1">
          {statusLabels[tournament.status]}
        </Badge>
      </div>
      <div className="hidden text-center sm:block">
        <p className="heading text-2xl">
          {registered} / {tournament.maxTeams}
        </p>
        <p className="heading text-[11px] text-muted">Tilmeldte hold</p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}

function TournamentsPage() {
  const { data: tournaments, isPending } = useQuery(tournamentsQuery());
  const published = (tournaments ?? []).filter((tournament) => tournament.published);
  const upcoming = published.filter((t) => t.status !== "FINISHED").sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const finished = published.filter((t) => t.status === "FINISHED");

  return (
    <Page>
      <PageTitle>Turneringer</PageTitle>
      {isPending ? (
        <PageSpinner />
      ) : published.length === 0 ? (
        <EmptyState title="Ingen turneringer endnu">Kom tilbage senere ☕</EmptyState>
      ) : (
        <div className="flex flex-col gap-8">
          {upcoming.length > 0 && (
            <section className="flex flex-col divide-y divide-border">
              {upcoming.map((tournament) => (
                <TournamentRow key={tournament.id} tournament={tournament} />
              ))}
            </section>
          )}
          {finished.length > 0 && (
            <section>
              <h2 className="heading mb-2 px-3 text-sm text-muted">Tidligere turneringer</h2>
              <div className="flex flex-col divide-y divide-border opacity-80">
                {finished.map((tournament) => (
                  <TournamentRow key={tournament.id} tournament={tournament} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Page>
  );
}
