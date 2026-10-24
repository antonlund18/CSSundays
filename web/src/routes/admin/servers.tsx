import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Play, RefreshCw, Square } from "lucide-react";
import { toast } from "sonner";
import { phaseLabels } from "@/api/matches";
import { matchServersEnabledQuery, matchServersQuery, stopMatchServer, type MatchServer } from "@/api/servers";
import { Page, PageTitle, Panel } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge, EmptyState, PageSpinner } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";

export const Route = createFileRoute("/admin/servers")({
  component: AdminServersPage,
});

function serverState(server: MatchServer) {
  if (server.booting) return { label: "Starter", tone: "warning" as const };
  if (server.on) return { label: "Tændt", tone: "success" as const };
  return { label: "Slukket", tone: "neutral" as const };
}

/** What the server is used for: a match, the test server, or nothing (left over and safe to stop). */
function Usage({ server }: { server: MatchServer }) {
  const { match } = server;
  if (match) {
    const teams = `${match.registration1?.team.name ?? "?"} vs ${match.registration2?.team.name ?? "?"}`;
    return (
      <div className="flex min-w-0 flex-col gap-0.5">
        <Link to="/matches/$matchId" params={{ matchId: String(match.id) }} className="flex items-center gap-1 font-bold hover:text-primary">
          {teams} <ExternalLink className="size-3.5" />
        </Link>
        <span className="text-xs text-muted">
          {match.tournament.name} · {phaseLabels[match.phase]}
          {match.score1 !== null && match.score2 !== null && ` · ${match.score1}–${match.score2}`}
        </span>
      </div>
    );
  }
  if (server.isTestServer) {
    return (
      <Link to="/admin/match-test" className="flex items-center gap-1 font-bold hover:text-primary">
        Test-server <ExternalLink className="size-3.5" />
      </Link>
    );
  }
  return <span className="text-sm text-warning">Ingen kamp – efterladt server</span>;
}

function ServerRow({ server, onStop, stopping }: { server: MatchServer; onStop: () => void; stopping: boolean }) {
  const state = serverState(server);
  return (
    <Panel className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <Usage server={server} />
        <p className="mt-1 truncate font-mono text-xs text-muted">
          {server.name} ({server.gameServerId})
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={state.tone}>{state.label}</Badge>
        {server.playersOnline !== null && <span className="text-xs text-muted">{server.playersOnline} spillere</span>}
        {server.address && (
          <Button asChild size="sm" variant="outline">
            <a href={`steam://connect/${server.address}`}>
              <Play /> {server.address}
            </a>
          </Button>
        )}
        <Button size="sm" variant="outline" disabled={stopping} onClick={onStop}>
          <Square /> Stop
        </Button>
      </div>
    </Panel>
  );
}

function AdminServersPage() {
  const queryClient = useQueryClient();
  const { data: enabled } = useQuery(matchServersEnabledQuery());
  const { data: servers, isPending, isFetching, refetch } = useQuery({ ...matchServersQuery(), enabled: !!enabled });

  const stop = useMutation({
    mutationFn: (server: MatchServer) => stopMatchServer(server.gameServerId),
    onSuccess: (_result, server) => {
      toast.success("Serveren er stoppet og slettet");
      queryClient.invalidateQueries({ queryKey: ["matchServers"] });
      if (server.isTestServer) queryClient.invalidateQueries({ queryKey: ["testServer"] });
      if (server.match) queryClient.invalidateQueries({ queryKey: ["match", server.match.id] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const confirmStop = (server: MatchServer) => {
    const message = server.match
      ? "Stop og slet serveren? Kampen bliver markeret som fejlet, og resultatet skal registreres manuelt (eller en ny server startes fra kampsiden)."
      : "Stop og slet serveren?";
    if (confirm(message)) stop.mutate(server);
  };

  return (
    <Page>
      <PageTitle subtitle="Denne deployments servere på DatHost. De koster penge, så længe de findes.">Servere</PageTitle>
      {enabled === false ? (
        <EmptyState title="DatHost er ikke sat op">Automatiske servere er slået fra på API'et (se README, trin 7).</EmptyState>
      ) : isPending ? (
        <PageSpinner />
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <Button variant="outline" size="sm" disabled={isFetching} onClick={() => refetch()}>
              <RefreshCw /> Opdatér
            </Button>
          </div>
          {servers?.length ? (
            <div className="flex flex-col gap-3">
              {servers.map((server) => (
                <ServerRow
                  key={server.gameServerId}
                  server={server}
                  stopping={stop.isPending && stop.variables?.gameServerId === server.gameServerId}
                  onStop={() => confirmStop(server)}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="Ingen servere kører" />
          )}
        </>
      )}
    </Page>
  );
}
