import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { tournamentsQuery } from "@/api/tournaments";
import { Button } from "@/components/ui/button";
import { formatLongDateTime } from "@/lib/format";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function NextTournament() {
  const { data: tournaments } = useQuery(tournamentsQuery());
  const upcoming = tournaments
    ?.filter((tournament) => tournament.published && tournament.status !== "FINISHED")
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
  if (!upcoming) return null;

  return (
    <Link
      to="/tournaments/$tournamentId"
      params={{ tournamentId: String(upcoming.id) }}
      className="group mt-10 flex w-full max-w-xl items-center gap-4 rounded-xl border border-white/10 bg-surface/70 p-4 text-left backdrop-blur transition hover:border-primary"
    >
      <div className="min-w-0 flex-1">
        <p className="heading text-xs text-primary">Næste turnering</p>
        <p className="heading truncate text-lg text-white">{upcoming.name}</p>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" /> {formatLongDateTime(upcoming.startsAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" /> {upcoming.registrationCount} / {upcoming.maxTeams} hold
          </span>
        </p>
      </div>
      <ArrowRight className="size-5 text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}

function HomePage() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="heading text-6xl sm:text-8xl">
        <span className="text-white">CS</span>
        <span className="text-primary">Sundays</span>
      </h1>
      <p className="mt-4 text-lg text-white/85">De fedeste Counter-Strike turneringer</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/tournaments">Se turneringer</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/teams">Find hold</Link>
        </Button>
      </div>
      <NextTournament />
    </main>
  );
}
