import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Player } from "@/api/players";
import { inviteToTeam, invitesForPlayerQuery, myTeamsQuery } from "@/api/teams";
import { useAuth } from "@/auth/AuthProvider";
import { StoredImage } from "@/components/avatars";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";

export function InviteDialog({ player, open, onOpenChange }: { player: Player; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data: teams = [] } = useQuery({ ...myTeamsQuery(userId ?? ""), enabled: !!userId && open });
  const { data: invites = [] } = useQuery({ ...invitesForPlayerQuery(player.id), enabled: open });

  const invite = useMutation({
    mutationFn: (teamId: number) => inviteToTeam(teamId, player.id),
    onSuccess: () => {
      toast.success(`${player.playertag} er inviteret`);
      queryClient.invalidateQueries({ queryKey: ["invites", player.id] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const memberOf = new Set(player.teams.map((team) => team.id));
  const pending = new Set(invites.filter((entry) => entry.status === "PENDING").map((entry) => entry.team.id));
  const visible = teams.filter((team) => team.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={`Inviter ${player.playertag} til hold`}>
        <DialogBody className="flex flex-col gap-4">
          <Input icon={<Search />} placeholder="Søg efter hold..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {teams.length === 0 ? (
            <EmptyState title="Du er ikke på nogle hold" />
          ) : (
            <div className="flex max-h-96 flex-col divide-y divide-border overflow-y-auto">
              {visible.map((team) => {
                const status = memberOf.has(team.id) ? "Er på holdet" : pending.has(team.id) ? "Inviteret" : null;
                return (
                  <div key={team.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="flex min-w-0 items-center gap-3">
                      <StoredImage src={team.avatarUrl} fallback="team" alt="" className="size-8" rounded />
                      <span className="truncate font-bold">{team.name}</span>
                    </span>
                    <Button size="sm" variant="outline" disabled={!!status || invite.isPending} onClick={() => invite.mutate(team.id)}>
                      {status ?? "Inviter"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
