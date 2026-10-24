import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Server, Trophy } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { reportWinner, restartMatch, setMatchServer, type MatchDetails } from "@/api/matches";
import { Panel } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/errors";

/** Arranger tools on the match page (replaces the old Ctrl+Shift+A command palette). */
export function StaffControls({ match }: { match: MatchDetails }) {
  const queryClient = useQueryClient();
  const [address, setAddress] = useState<string | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["match", match.id] });
    queryClient.invalidateQueries({ queryKey: ["bracket", match.tournamentId] });
  };
  const onError = (error: unknown) => toast.error(errorMessage(error));

  const winner = useMutation({
    mutationFn: (side: 1 | 2) => reportWinner(match.id, side),
    onSuccess: () => {
      toast.success("Resultatet er registreret");
      refresh();
    },
    onError,
  });
  const restart = useMutation({
    mutationFn: () => restartMatch(match.id),
    onSuccess: () => {
      toast.success("Kampen er genstartet");
      refresh();
    },
    onError,
  });
  const saveServer = useMutation({
    mutationFn: (value: string) => setMatchServer(match.id, value),
    onSuccess: () => {
      toast.success("Server gemt");
      setAddress(null);
      refresh();
    },
    onError,
  });

  const playable = !!match.registration1 && !!match.registration2 && match.phase !== "FINISHED" && match.phase !== "CANCELLED";
  const live = match.phase === "READY_CHECK" || match.phase === "PICK_AND_BAN" || match.phase === "IN_PROGRESS";

  const submitServer = (event: FormEvent) => {
    event.preventDefault();
    saveServer.mutate(address ?? match.serverAddress ?? "");
  };

  return (
    <Panel className="p-4">
      <p className="heading mb-3 text-xs text-warning">Arrangør</p>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-wrap gap-2">
          {([1, 2] as const).map((side) => {
            const team = side === 1 ? match.registration1?.team : match.registration2?.team;
            return (
              <Button
                key={side}
                variant="outline"
                size="sm"
                disabled={!playable || match.tournament?.status !== "IN_PROGRESS" || winner.isPending}
                onClick={() => {
                  if (confirm(`Registrér ${team?.name} som vinder?`)) winner.mutate(side);
                }}
              >
                <Trophy /> {team?.name ?? `Hold ${side}`} vandt
              </Button>
            );
          })}
          <Button variant="ghost" size="sm" disabled={!live || restart.isPending} onClick={() => restart.mutate()}>
            <RotateCcw /> Genstart klar-tjek
          </Button>
        </div>
        <form onSubmit={submitServer} className="flex flex-1 gap-2">
          <Input
            icon={<Server />}
            placeholder="Server IP:port"
            value={address ?? match.serverAddress ?? ""}
            onChange={(event) => setAddress(event.target.value)}
            className="flex-1"
            aria-label="Server-adresse"
          />
          <Button type="submit" size="md" variant="outline" disabled={saveServer.isPending}>
            Gem
          </Button>
        </form>
      </div>
    </Panel>
  );
}
