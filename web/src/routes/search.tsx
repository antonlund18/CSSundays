import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, Link2, Search, Shield, Trophy, User } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { MIN_SEARCH_LENGTH, searchQuery, searchTypeLabels, searchTypes, type SearchType } from "@/api/search";
import { StoredImage } from "@/components/avatars";
import { Page, PageTitle } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, Spinner } from "@/components/ui/misc";
import { formatDate, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string; type?: SearchType } => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    type: searchTypes.includes(search.type as SearchType) && search.type !== "all" ? (search.type as SearchType) : undefined,
  }),
  component: SearchPage,
});

const icons: Record<SearchType, ReactNode> = {
  all: <LayoutGrid />,
  players: <User />,
  teams: <Shield />,
  tournaments: <Trophy />,
};

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
}

function ResultRow({ to, icon, image, title, meta }: { to: ReactNode; icon: ReactNode; image: ReactNode; title: string; meta: ReactNode }) {
  return (
    <div className="group relative flex items-center gap-4 rounded-lg bg-surface-2/50 px-4 py-3 transition-colors hover:bg-surface-2">
      <span className="text-primary [&_svg]:size-5">{icon}</span>
      <span className="h-8 w-px bg-border" />
      {image}
      <div className="min-w-0">
        <p className="truncate font-bold group-hover:text-primary">{title}</p>
        <p className="truncate text-xs text-muted">{meta}</p>
      </div>
      {to}
    </div>
  );
}

const overlay = "absolute inset-0 rounded-lg";

function SearchPage() {
  const { q = "", type = "all" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [text, setText] = useState(q);
  const debounced = useDebounced(text, 400);

  useEffect(() => {
    if (debounced !== q) navigate({ search: (prev) => ({ ...prev, q: debounced || undefined }), replace: true });
  }, [debounced, q, navigate]);

  const { data, isFetching } = useQuery(searchQuery(q, type));
  const valid = q.trim().length >= MIN_SEARCH_LENGTH;
  const total = data ? data.players.length + data.teams.length + data.tournaments.length : 0;

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.info("Søgning kopieret til udklipsholderen");
  };

  return (
    <Page>
      <PageTitle>Søg</PageTitle>
      <Input
        icon={<Search />}
        placeholder="Søg efter spillere, hold og turneringer..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        autoFocus
        trailing={
          <Button variant="ghost" size="icon" className="size-8" onClick={copyLink} aria-label="Kopiér link til søgningen">
            <Link2 />
          </Button>
        }
      />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {searchTypes.map((option) => (
          <button
            key={option}
            onClick={() => navigate({ search: (prev) => ({ ...prev, type: option === "all" ? undefined : option }), replace: true })}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-lg border-2 px-4 py-3 transition [&_svg]:size-5",
              type === option ? "border-primary bg-primary/10 text-white" : "border-border text-muted hover:border-primary/60 hover:text-foreground",
            )}
          >
            <span className="heading text-xs">{searchTypeLabels[option]}</span>
            <span className="text-primary">{icons[option]}</span>
          </button>
        ))}
      </div>

      <h2 className="heading mt-8 mb-3 text-sm text-muted">Resultater</h2>
      {!valid ? (
        <EmptyState title="Begynd din søgning ovenfor">Indtast mindst {MIN_SEARCH_LENGTH} tegn for at gå i gang</EmptyState>
      ) : isFetching && !data ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : total === 0 ? (
        <EmptyState title={`Ingen resultater for '${q}'`}>Prøv igen</EmptyState>
      ) : (
        <div className="flex flex-col gap-2">
          {data?.players.map((player) => (
            <ResultRow
              key={`p${player.id}`}
              to={<Link to="/players/$playertag" params={{ playertag: player.playertag }} className={overlay} aria-label={player.playertag} />}
              icon={icons.players}
              image={<StoredImage src={player.avatarUrl} fallback="player" alt="" className="size-10" />}
              title={player.playertag}
              meta={`Bruger siden ${formatDate(player.createdAt)}`}
            />
          ))}
          {data?.teams.map((team) => (
            <ResultRow
              key={`t${team.id}`}
              to={<Link to="/teams/$teamId" params={{ teamId: String(team.id) }} className={overlay} aria-label={team.name} />}
              icon={icons.teams}
              image={<StoredImage src={team.avatarUrl} fallback="team" alt="" className="size-10" />}
              title={team.name}
              meta={`Oprettet af ${team.owner.playertag} · ${team.memberCount} medlemmer · ${formatDate(team.createdAt)}`}
            />
          ))}
          {data?.tournaments.map((tournament) => (
            <ResultRow
              key={`c${tournament.id}`}
              to={<Link to="/tournaments/$tournamentId" params={{ tournamentId: String(tournament.id) }} className={overlay} aria-label={tournament.name} />}
              icon={icons.tournaments}
              image={<StoredImage src={tournament.pictureUrl} fallback="tournament" alt="" className="size-10" />}
              title={tournament.name}
              meta={`${formatDateTime(tournament.startsAt)} · ${tournament.registrationCount} tilmeldte hold`}
            />
          ))}
        </div>
      )}
    </Page>
  );
}
