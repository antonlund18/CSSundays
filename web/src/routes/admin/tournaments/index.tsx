import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Eye, EyeOff, GitFork, MoreVertical, Pencil, Play, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteTournament,
  generateBracket,
  startTournament,
  statusLabels,
  tournamentsQuery,
  setTournamentPublished,
  type TournamentListItem,
} from "@/api/tournaments";
import { Page, PageTitle } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge, EmptyState, PageSpinner } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/admin/tournaments/")({
  component: AdminTournamentsPage,
});

type SortKey = "name" | "published" | "startsAt" | "createdAt";

function RowMenu({ tournament }: { tournament: TournamentListItem }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    queryClient.invalidateQueries({ queryKey: ["tournament", tournament.id] });
    queryClient.invalidateQueries({ queryKey: ["bracket", tournament.id] });
  };
  const action = useMutation({
    mutationFn: async (kind: "publish" | "unpublish" | "bracket" | "start" | "delete") => {
      if (kind === "publish") await setTournamentPublished(tournament.id, true);
      if (kind === "unpublish") await setTournamentPublished(tournament.id, false);
      if (kind === "bracket") await generateBracket(tournament.id);
      if (kind === "start") await startTournament(tournament.id);
      if (kind === "delete") await deleteTournament(tournament.id);
      return kind;
    },
    onSuccess: (kind) => {
      const messages = {
        publish: `'${tournament.name}' blev publiceret`,
        unpublish: `'${tournament.name}' er ikke længere publiceret`,
        bracket: `Bracket oprettet for '${tournament.name}'`,
        start: `Turnering startet: '${tournament.name}'`,
        delete: `'${tournament.name}' er slettet`,
      };
      toast.success(messages[kind]);
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const notStarted = tournament.status === "OPEN_FOR_REGISTRATIONS" || tournament.status === "CLOSED_FOR_REGISTRATIONS";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Handlinger" disabled={action.isPending}>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => navigate({ to: "/admin/tournaments/$tournamentId", params: { tournamentId: String(tournament.id) } })}>
          <Pencil /> Rediger
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => action.mutate(tournament.published ? "unpublish" : "publish")}>
          {tournament.published ? (
            <>
              <EyeOff /> Fjern publicering
            </>
          ) : (
            <>
              <Eye /> Publicér
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!notStarted}
          onSelect={() => {
            if (confirm("Opret (eller genopret) bracket? Tilmeldingen lukkes.")) action.mutate("bracket");
          }}
        >
          <GitFork /> Opret bracket
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={tournament.status !== "CLOSED_FOR_REGISTRATIONS"}
          onSelect={() => {
            if (confirm(`Start '${tournament.name}'? Alle klar kampe begynder klar-tjek.`)) action.mutate("start");
          }}
        >
          <Play /> Start turnering
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-danger"
          onSelect={() => {
            if (confirm(`Slet '${tournament.name}' permanent?`)) action.mutate("delete");
          }}
        >
          <Trash2 /> Slet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AdminTournamentsPage() {
  const { data: tournaments, isPending } = useQuery(tournamentsQuery());
  const [search, setSearch] = useState("");
  const [showPublished, setShowPublished] = useState(true);
  const [showUnpublished, setShowUnpublished] = useState(true);
  const [sort, setSort] = useState<SortKey>("createdAt");
  const [ascending, setAscending] = useState(false);

  const rows = (tournaments ?? [])
    .filter((t) => (t.published ? showPublished : showUnpublished))
    .filter((t) => t.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      const order =
        sort === "name"
          ? a.name.localeCompare(b.name, "da")
          : sort === "published"
            ? Number(a.published) - Number(b.published)
            : a[sort].localeCompare(b[sort]);
      return ascending ? order : -order;
    });

  const header = (key: SortKey, label: string, className = "") => (
    <th className={`px-3 py-3 ${className}`}>
      <button
        className="inline-flex cursor-pointer items-center gap-1 hover:text-foreground"
        onClick={() => {
          if (sort === key) setAscending((value) => !value);
          else {
            setSort(key);
            setAscending(true);
          }
        }}
      >
        {label}
        {sort === key && (ascending ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
      </button>
    </th>
  );

  return (
    <Page wide>
      <PageTitle
        actions={
          <Button asChild>
            <Link to="/admin/tournaments/new">
              <Plus /> Opret turnering
            </Link>
          </Button>
        }
      >
        Turneringsredigering
      </PageTitle>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Input icon={<Search />} placeholder="Søg efter turnering..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-80" />
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={showPublished} onChange={(e) => setShowPublished(e.target.checked)} className="accent-primary" />
          Vis publicerede
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={showUnpublished} onChange={(e) => setShowUnpublished(e.target.checked)} className="accent-primary" />
          Vis ikke-publicerede
        </label>
      </div>
      {isPending ? (
        <PageSpinner />
      ) : rows.length === 0 ? (
        <EmptyState title="Ingen turneringer" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="heading text-xs text-muted">
              <tr className="border-b border-border">
                {header("name", "Navn")}
                <th className="px-3 py-3">Status</th>
                {header("published", "Publiceret")}
                {header("startsAt", "Start", "text-right")}
                {header("createdAt", "Oprettet", "text-right")}
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {rows.map((tournament) => (
                <tr key={tournament.id} className="border-b border-border/60 hover:bg-surface-2/50">
                  <td className="px-3 py-3">
                    <Link to="/tournaments/$tournamentId" params={{ tournamentId: String(tournament.id) }} className="font-bold hover:text-primary">
                      {tournament.name}
                    </Link>{" "}
                    <span className="text-muted">
                      ({tournament.registrationCount} / {tournament.maxTeams})
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Badge>{statusLabels[tournament.status]}</Badge>
                  </td>
                  <td className="px-3 py-3">{tournament.published ? "Ja" : "Nej"}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">{formatDateTime(tournament.startsAt)}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">{formatDateTime(tournament.createdAt)}</td>
                  <td className="px-1 py-1 text-right">
                    <RowMenu tournament={tournament} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Page>
  );
}
