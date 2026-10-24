import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Play, RefreshCw, Server, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { GameMap } from "@/api/matches";
import { matchServersEnabledQuery, startTestServer, stopTestServer, testServerQuery, type TestServer } from "@/api/servers";
import { useAuth } from "@/auth/AuthProvider";
import { Panel, SectionTitle } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";

function status(server: TestServer) {
  if (server.cancelReason) return { label: `Annulleret (${server.cancelReason})`, tone: "warning" as const };
  if (server.finished) return { label: "Færdig", tone: "success" as const };
  return { label: "Kører", tone: "primary" as const };
}

/**
 * Creates a throwaway DatHost server, so staff can check the setup end to end:
 * the server boots on the chosen map and lets in the listed Steam accounts.
 */
export function TestServerPanel({
  maps,
  defaultMap,
  onChange,
}: {
  maps: GameMap[];
  /** The simulated match's map, used once the veto is done. */
  defaultMap: string | null;
  onChange: (server: TestServer | null) => void;
}) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const { data: enabled } = useQuery(matchServersEnabledQuery());
  const { data: server, refetch, isFetching } = useQuery({ ...testServerQuery(), enabled: !!enabled });
  const [map, setMap] = useState<string | null>(null);
  const [steamIds, setSteamIds] = useState<string | null>(null);

  // Mirror the live server into the simulated match (address, score).
  useEffect(() => {
    if (enabled) onChange(server ?? null);
  }, [enabled, server, onChange]);

  const chosenMap = map ?? defaultMap ?? maps.find((entry) => entry.active)?.slug ?? "";
  const ids = steamIds ?? profile?.steamId ?? "";

  const setServer = (next: TestServer | null) => queryClient.setQueryData(testServerQuery().queryKey, next);
  const start = useMutation({
    mutationFn: () => startTestServer(chosenMap, ids.split(/[\s,]+/).filter(Boolean)),
    onSuccess: (next) => {
      toast.success("Test-serveren starter");
      setServer(next ?? null);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const stop = useMutation({
    mutationFn: stopTestServer,
    onSuccess: () => {
      toast.success("Test-serveren er stoppet");
      setServer(null);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (enabled === undefined) return null;

  return (
    <Panel className="flex flex-col gap-3 p-4">
      <SectionTitle className="mb-0">DatHost test-server</SectionTitle>
      {!enabled ? (
        <p className="text-xs text-muted">DatHost er ikke sat op på API'et (se README, trin 7). Kampserver-adressen kan stadig skrives ind manuelt.</p>
      ) : server ? (
        <>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-mono">{server.map}</span>
            <Badge tone={status(server).tone}>{status(server).label}</Badge>
          </div>
          {server.score1 !== null && server.score2 !== null && (
            <p className="text-sm">
              Stilling: <span className="font-bold tabular-nums">{server.score1} – {server.score2}</span>
            </p>
          )}
          {server.address ? (
            <Button asChild size="sm">
              <a href={`steam://connect/${server.address}`}>
                <Play /> connect {server.address}
              </a>
            </Button>
          ) : (
            <p className="text-xs text-muted">DatHost gav ingen adresse – se serveren i DatHost-dashboardet.</p>
          )}
          <p className="text-xs text-muted">
            Server <span className="font-mono">{server.gameServerId}</span>, DatHost-kamp <span className="font-mono">{server.dathostMatchId}</span>
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={isFetching} onClick={() => refetch()}>
              <RefreshCw /> Opdatér
            </Button>
            <Button variant="outline" size="sm" disabled={stop.isPending} onClick={() => stop.mutate()}>
              <Square /> Stop
            </Button>
          </div>
          <p className="text-xs text-muted">Serveren slettes igen, når du stopper den eller kampen er færdig.</p>
        </>
      ) : (
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            start.mutate();
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            Kort
            <Select value={chosenMap} onChange={(event) => setMap(event.target.value)}>
              {maps.map((entry) => (
                <option key={entry.slug} value={entry.slug}>
                  {entry.name} ({entry.serverMap ?? `de_${entry.slug}`})
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Steam ID'er der må joine
            <Textarea
              value={ids}
              onChange={(event) => setSteamIds(event.target.value)}
              placeholder="7656119…"
              className="min-h-16 font-mono text-xs"
            />
          </label>
          {!profile?.steamId && <p className="text-xs text-warning">Forbind din egen Steam-konto på din profil for at kunne joine.</p>}
          <Button type="submit" size="sm" disabled={start.isPending || !chosenMap || !ids.trim()}>
            <Server /> Start test-server
          </Button>
          <p className="text-xs text-muted">Opretter en rigtig server på DatHost, som koster penge, indtil den bliver slettet.</p>
        </form>
      )}
    </Panel>
  );
}
