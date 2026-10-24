import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, LogOut, UserMinus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/api/players";
import { leaveTeam, removeTeamMember, teamQuery } from "@/api/teams";
import { useAuth } from "@/auth/AuthProvider";
import { PlayerTile } from "@/components/avatars";
import { ImagePicker } from "@/components/ImagePicker";
import { Page, PageTitle, Panel, SectionTitle } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { PageSpinner, Tooltip } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";
import { formatDate, winrate } from "@/lib/format";

export const Route = createFileRoute("/teams/$teamId")({
  loader: async ({ context, params }) => {
    const id = Number(params.teamId);
    if (!Number.isInteger(id)) throw notFound();
    const team = await context.queryClient.ensureQueryData(teamQuery(id));
    if (!team) throw notFound();
  },
  pendingComponent: PageSpinner,
  component: TeamPage,
});

function TeamPage() {
  const { teamId } = Route.useParams();
  const id = Number(teamId);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: team } = useQuery(teamQuery(id));
  const [uploading, setUploading] = useState(false);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["team", id] });
    queryClient.invalidateQueries({ queryKey: ["teams"] });
    queryClient.invalidateQueries({ queryKey: ["my-teams"] });
    queryClient.invalidateQueries({ queryKey: ["player"] });
  };

  const leave = useMutation({
    mutationFn: () => leaveTeam(id),
    onSuccess: () => {
      toast.success("Du har forladt holdet");
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const kick = useMutation({
    mutationFn: (memberId: string) => removeTeamMember(id, memberId),
    onSuccess: () => {
      toast.success("Spilleren er fjernet fra holdet");
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (!team) return <PageSpinner />;

  const isOwner = team.ownerId === userId;
  const isMember = team.members.some((user) => user.id === userId);

  const changePicture = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadImage("TEAM", file, team.id);
      toast.success("Billede opdateret");
      refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Page>
      <PageTitle
        actions={
          isMember && !isOwner ? (
            <Button
              variant="outline"
              disabled={leave.isPending}
              onClick={() => {
                if (confirm(`Forlad ${team.name}?`)) leave.mutate();
              }}
            >
              <LogOut /> Forlad hold
            </Button>
          ) : null
        }
      >
        {team.name}
      </PageTitle>

      <div className="grid gap-8 md:grid-cols-[18rem_1fr]">
        <div className="flex flex-col gap-4">
          <ImagePicker
            src={team.avatarUrl}
            fallback="team"
            file={null}
            onFileChange={changePicture}
            disabled={!isOwner || uploading}
            label="Upload billede"
          />
          <dl className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2">
              <dt className="heading text-xs text-muted">Ejer</dt>
              <dd>
                <Link to="/players/$playertag" params={{ playertag: team.owner.playertag }} className="font-bold hover:text-primary">
                  {team.owner.playertag} ↗
                </Link>
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="heading text-xs text-muted">Dato oprettet</dt>
              <dd className="font-bold">{formatDate(team.createdAt)}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="heading text-xs text-muted">Antal spillere</dt>
              <dd className="font-bold">{team.members.length}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-8">
          <section>
            <SectionTitle>Spillere</SectionTitle>
            <Panel className="flex flex-wrap gap-3 p-4">
              {team.members.map((user) => (
                <div key={user.id} className="relative">
                  <PlayerTile player={user} className="w-24" highlight={user.id === team.ownerId} />
                  {user.steamId && (
                    <Tooltip content="Steam verificeret">
                      <BadgeCheck className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-surface text-success" />
                    </Tooltip>
                  )}
                  {isOwner && user.id !== userId && (
                    <button
                      onClick={() => {
                        if (confirm(`Fjern ${user.playertag} fra holdet?`)) kick.mutate(user.id);
                      }}
                      className="absolute -top-1.5 -left-1.5 cursor-pointer rounded-full bg-surface p-1 text-muted hover:text-danger"
                      aria-label={`Fjern ${user.playertag}`}
                    >
                      <UserMinus className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </Panel>
            {isMember && (
              <p className="mt-2 text-xs text-muted">
                Inviter spillere fra deres profil:{" "}
                <button className="cursor-pointer text-primary hover:underline" onClick={() => navigate({ to: "/search", search: { type: "players" } })}>
                  find spillere
                </button>
              </p>
            )}
          </section>

          <section>
            <SectionTitle>Statistik</SectionTitle>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Wins", team.wins, "text-success"],
                ["Losses", team.losses, "text-danger"],
                ["Winrate", winrate(team.wins, team.losses), "text-white"],
              ].map(([label, value, color]) => (
                <Panel key={label as string} className="p-4 text-center">
                  <p className={`heading text-3xl ${color}`}>{value}</p>
                  <p className="heading mt-1 text-xs text-muted">{label}</p>
                </Panel>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Page>
  );
}
