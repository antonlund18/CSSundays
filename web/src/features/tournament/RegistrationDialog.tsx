import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, HelpCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { myTeamsQuery } from "@/api/teams";
import {
  leaveTournament,
  myRegistrationQuery,
  registerForTournament,
  type TournamentDetails,
} from "@/api/tournaments";
import { useAuth } from "@/auth/AuthProvider";
import { PlayerTile, StoredImage } from "@/components/avatars";
import { CreateTeamDialog } from "@/components/CreateTeamDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent } from "@/components/ui/dialog";
import { Badge, EmptyState, PageSpinner } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";

const ROSTER_SIZE = 5;

function useInvalidateTournament(tournamentId: number) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["tournament", tournamentId] });
    queryClient.invalidateQueries({ queryKey: ["registration", tournamentId] });
    queryClient.invalidateQueries({ queryKey: ["tournaments"] });
  };
}

function AlreadyRegistered({ tournament, userId }: { tournament: TournamentDetails; userId: string }) {
  const { data: registration } = useQuery(myRegistrationQuery(tournament.id, userId));
  const invalidate = useInvalidateTournament(tournament.id);
  const leave = useMutation({
    mutationFn: () => leaveTournament(tournament.id),
    onSuccess: () => {
      toast.success("Du er afmeldt");
      invalidate();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  if (!registration) return null;

  const isCaptain = registration.captainId === userId;
  const empty = Math.max(0, ROSTER_SIZE - registration.players.length);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <CheckCircle2 className="size-16 text-success" />
      <p className="heading text-sm">Du er tilmeldt</p>
      <div className="flex items-center gap-3">
        <StoredImage src={registration.team.avatarUrl} fallback="team" alt="" className="size-14" />
        <span className="heading text-2xl">{registration.team.name}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {registration.players.map((user) => (
          <PlayerTile key={user.id} player={user} highlight={user.id === registration.captainId} />
        ))}
        {Array.from({ length: empty }, (_, index) => (
          <div key={index} className="flex aspect-square w-20 items-center justify-center rounded-md border-2 border-dashed border-border text-muted">
            <HelpCircle className="size-6" />
          </div>
        ))}
      </div>
      <p className="max-w-sm text-xs text-muted">
        {isCaptain
          ? "Du er holdkaptajn. Dine holdkammerater tilmelder sig ved at vælge holdet her. Afmelder du dig, afmeldes hele holdet."
          : "Holdkaptajnen er markeret med blåt."}
      </p>
      {tournament.status === "OPEN_FOR_REGISTRATIONS" && (
        <Button variant="outline" disabled={leave.isPending} onClick={() => leave.mutate()}>
          {isCaptain ? "Afmeld holdet" : "Afmeld"}
        </Button>
      )}
    </div>
  );
}

function ChooseTeam({ tournament, userId, onCreateTeam }: { tournament: TournamentDetails; userId: string; onCreateTeam: () => void }) {
  const { data: teams, isPending } = useQuery(myTeamsQuery(userId));
  const invalidate = useInvalidateTournament(tournament.id);
  const register = useMutation({
    mutationFn: (teamId: number) => registerForTournament(tournament.id, teamId),
    onSuccess: () => {
      toast.success("Du er tilmeldt turneringen!");
      invalidate();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (isPending) return <PageSpinner />;
  if (!teams?.length) {
    return (
      <EmptyState title="Du er ikke på nogle hold">
        <p>Opret et hold for at tilmelde dig turneringen</p>
        <Button className="mt-4" onClick={onCreateTeam}>
          Opret hold
        </Button>
      </EmptyState>
    );
  }

  const registered = new Map(tournament.registrations.map((registration) => [registration.team.id, registration]));

  return (
    <div className="flex flex-col divide-y divide-border">
      {teams.map((team) => {
        const registration = registered.get(team.id);
        return (
          <div key={team.id} className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <StoredImage src={team.avatarUrl} fallback="team" alt="" className="size-10" />
              <div className="min-w-0">
                <p className="truncate font-bold">{team.name}</p>
                {registration ? (
                  <Badge tone="success">
                    Tilmeldt ({registration.players.length}/{ROSTER_SIZE})
                  </Badge>
                ) : (
                  <Badge>Ikke tilmeldt</Badge>
                )}
              </div>
            </div>
            <Button
              size="sm"
              disabled={register.isPending || (registration && registration.players.length >= ROSTER_SIZE)}
              onClick={() => register.mutate(team.id)}
            >
              {registration ? "Tilmeld mig" : "Tilmeld holdet"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export function RegistrationDialog({
  tournament,
  open,
  onOpenChange,
}: {
  tournament: TournamentDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { userId } = useAuth();
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const { data: registration, isPending } = useQuery({
    ...myRegistrationQuery(tournament.id, userId ?? ""),
    enabled: !!userId && open,
  });

  if (!userId) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent title="Tilmeld turnering" description={tournament.name}>
          <DialogBody className="min-h-64">
            {isPending ? (
              <PageSpinner />
            ) : registration ? (
              <AlreadyRegistered tournament={tournament} userId={userId} />
            ) : (
              <ChooseTeam
                tournament={tournament}
                userId={userId}
                onCreateTeam={() => {
                  onOpenChange(false);
                  setCreateTeamOpen(true);
                }}
              />
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
      <CreateTeamDialog open={createTeamOpen} onOpenChange={setCreateTeamOpen} />
    </>
  );
}
