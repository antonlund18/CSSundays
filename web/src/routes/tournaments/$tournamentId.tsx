import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowDownAZ, ArrowUpZA, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  bracketQuery,
  formatLabels,
  removeRegistration,
  statusLabels,
  TournamentChangedSubscription,
  tournamentQuery,
  type Registration,
  type TournamentDetails,
} from "@/api/tournaments";
import { useAuth } from "@/auth/AuthProvider";
import { PlayerTile, StoredImage } from "@/components/avatars";
import { Page } from "@/components/layout";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, EmptyState, PageSpinner } from "@/components/ui/misc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bracket } from "@/features/bracket/Bracket";
import { RegistrationDialog } from "@/features/tournament/RegistrationDialog";
import { errorMessage } from "@/lib/errors";
import { formatDate, formatTime } from "@/lib/format";
import { useLiveInvalidate } from "@/lib/graphql";

const tabs = ["info", "bracket", "rules", "teams", "media", "help"] as const;
type Tab = (typeof tabs)[number];

export const Route = createFileRoute("/tournaments/$tournamentId")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } => ({
    tab: tabs.includes(search.tab as Tab) ? (search.tab as Tab) : undefined,
  }),
  loader: async ({ context, params }) => {
    const id = Number(params.tournamentId);
    if (!Number.isInteger(id)) throw notFound();
    const tournament = await context.queryClient.ensureQueryData(tournamentQuery(id));
    if (!tournament) throw notFound();
  },
  pendingComponent: PageSpinner,
  component: TournamentPage,
});

function InfoTab({ tournament }: { tournament: TournamentDetails }) {
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_16rem]">
      <div className="min-w-0">
        {tournament.description ? <Markdown>{tournament.description}</Markdown> : <p className="text-muted">Ingen beskrivelse.</p>}
      </div>
      <dl className="flex flex-col gap-5 border-border md:border-l md:pl-8">
        {[
          ["Format", formatLabels[tournament.format]],
          ["Starttidspunkt", `${formatDate(tournament.startsAt)} kl. ${formatTime(tournament.startsAt)}`],
          ["Tilmeldte hold", `${tournament.registrations.length}/${tournament.maxTeams}`],
          ["Status", statusLabels[tournament.status]],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="heading text-xs text-muted">{label}</dt>
            <dd className="mt-1 font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function BracketTab({ tournament }: { tournament: TournamentDetails }) {
  const { userId } = useAuth();
  const { data: matches, isPending } = useQuery(bracketQuery(tournament.id));
  const registrations = useMemo(
    () => new Map<number, Registration>(tournament.registrations.map((registration) => [registration.id, registration])),
    [tournament.registrations],
  );

  useLiveInvalidate(TournamentChangedSubscription, { tournamentId: tournament.id }, [["bracket", tournament.id]]);

  if (isPending) return <PageSpinner />;
  if (!matches?.length) {
    return <EmptyState title="Der er ikke oprettet en bracket endnu">Kom tilbage senere ☕</EmptyState>;
  }
  return <Bracket matches={matches} registrations={registrations} currentUserId={userId} />;
}

function TeamsTab({ tournament }: { tournament: TournamentDetails }) {
  const { isStaff } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"number" | "name">("number");
  const [ascending, setAscending] = useState(true);
  const remove = useMutation({
    mutationFn: removeRegistration,
    onSuccess: () => {
      toast.success("Holdet er afmeldt");
      queryClient.invalidateQueries({ queryKey: ["tournament", tournament.id] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const entries = tournament.registrations
    .map((registration, index) => ({ registration, number: index + 1 }))
    .filter(({ registration }) => registration.team.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      const order = sort === "number" ? a.number - b.number : a.registration.team.name.localeCompare(b.registration.team.name, "da");
      return ascending ? order : -order;
    });

  const toggleSort = (next: "number" | "name") => {
    if (sort === next) setAscending((value) => !value);
    else {
      setSort(next);
      setAscending(true);
    }
  };

  const SortIcon = ascending ? ArrowDownAZ : ArrowUpZA;
  const canRemove = isStaff && tournament.status === "OPEN_FOR_REGISTRATIONS";

  return (
    <div className="flex flex-col gap-4">
      <Input icon={<Search />} placeholder="Søg efter hold..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {tournament.registrations.length === 0 ? (
        <EmptyState title="Ingen tilmeldte hold endnu" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="heading text-xs text-muted">
              <tr className="border-b border-border">
                {(["number", "name"] as const).map((column) => (
                  <th key={column} className="px-3 py-3">
                    <button className="inline-flex cursor-pointer items-center gap-1 hover:text-foreground" onClick={() => toggleSort(column)}>
                      {column === "number" ? "#" : "Hold"}
                      {sort === column && <SortIcon className="size-3.5" />}
                    </button>
                  </th>
                ))}
                <th className="px-3 py-3">Spillere</th>
                {canRemove && <th />}
              </tr>
            </thead>
            <tbody>
              {entries.map(({ registration, number }) => (
                <tr key={registration.id} className="border-b border-border/60">
                  <td className="heading px-3 py-3 text-muted">#{number}</td>
                  <td className="px-3 py-3">
                    <Link to="/teams/$teamId" params={{ teamId: String(registration.team.id) }} className="flex items-center gap-3 hover:text-primary">
                      <StoredImage src={registration.team.avatarUrl} fallback="team" alt="" className="size-12" />
                      <span className="heading">{registration.team.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1.5">
                      {registration.players.slice(0, 5).map((user) => (
                        <PlayerTile key={user.id} player={user} className="w-12" highlight={user.id === registration.captainId} />
                      ))}
                    </div>
                  </td>
                  {canRemove && (
                    <td className="px-3 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Afmeld ${registration.team.name}`}
                        disabled={remove.isPending}
                        onClick={() => {
                          if (confirm(`Afmeld ${registration.team.name} fra turneringen?`)) remove.mutate(registration.id);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MediaTab() {
  const channel = (import.meta.env.VITE_TWITCH_CHANNEL as string | undefined) || "cssundays";
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
      <iframe
        title="Twitch"
        src={`https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${window.location.hostname}&muted=true`}
        allowFullScreen
        className="size-full"
      />
    </div>
  );
}

function HelpTab() {
  return (
    <Markdown>
      {`## Sådan foregår en kamp

1. **Tilmelding** – én spiller tilmelder holdet og bliver holdkaptajn. Holdkammerater tilmelder sig ved at vælge det samme hold (maks. 5 spillere).
2. **Bracket** – når tilmeldingen lukker, opretter arrangørerne bracket. Overskydende pladser giver frirunder.
3. **Klar-tjek** – når kampen starter, har begge kaptajner 1 minut til at trykke *Klar*.
4. **Map veto** – kaptajnerne banner skiftevis et kort med 30 sekunder pr. tur. Når tiden løber ud, bannes et tilfældigt kort. Det sidste kort spilles.
5. **Kamp** – serverens IP vises for begge hold på kampsiden. Arrangørerne registrerer vinderen, som går videre i bracket.

Har du spørgsmål, så skriv i kampens chat eller kontakt en arrangør.`}
    </Markdown>
  );
}

function TournamentPage() {
  const { tournamentId } = Route.useParams();
  const { tab = "info" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { userId, requestLogin } = useAuth();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const { data: tournament } = useQuery(tournamentQuery(Number(tournamentId)));

  if (!tournament) return <PageSpinner />;

  const openRegistration = () => (userId ? setRegistrationOpen(true) : requestLogin("login"));
  const registered = tournament.registrations.length;

  return (
    <Page wide={tab === "bracket"}>
      <div className="-mx-5 -mt-5 mb-6 overflow-hidden rounded-t-2xl sm:-mx-8 sm:-mt-8">
        {tournament.pictureUrl && (
          <StoredImage src={tournament.pictureUrl} fallback="tournament" alt="" className="h-48 w-full rounded-none sm:h-72" />
        )}
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="heading text-2xl text-primary sm:text-3xl">{tournament.name}</h1>
              {!tournament.published && <Badge tone="warning">Ikke publiceret</Badge>}
            </div>
            <p className="text-sm text-muted">
              {registered} {registered === 1 ? "tilmeldt" : "tilmeldte"} hold · {statusLabels[tournament.status]}
            </p>
          </div>
          {tournament.status === "OPEN_FOR_REGISTRATIONS" && (
            <Button onClick={openRegistration}>
              <Plus /> Tilmeld
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={(value) => navigate({ search: { tab: value === "info" ? undefined : (value as Tab) }, replace: true })}>
        <TabsList className="mb-6">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="bracket">Bracket</TabsTrigger>
          <TabsTrigger value="rules">Regler</TabsTrigger>
          <TabsTrigger value="teams">Hold</TabsTrigger>
          <TabsTrigger value="media">Se med</TabsTrigger>
          <TabsTrigger value="help">Hjælp</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <InfoTab tournament={tournament} />
        </TabsContent>
        <TabsContent value="bracket">
          <BracketTab tournament={tournament} />
        </TabsContent>
        <TabsContent value="rules">
          {tournament.rules ? <Markdown>{tournament.rules}</Markdown> : <EmptyState title="Ingen regler endnu" />}
        </TabsContent>
        <TabsContent value="teams">
          <TeamsTab tournament={tournament} />
        </TabsContent>
        <TabsContent value="media">
          <MediaTab />
        </TabsContent>
        <TabsContent value="help">
          <HelpTab />
        </TabsContent>
      </Tabs>

      <RegistrationDialog tournament={tournament} open={registrationOpen} onOpenChange={setRegistrationOpen} />
    </Page>
  );
}
