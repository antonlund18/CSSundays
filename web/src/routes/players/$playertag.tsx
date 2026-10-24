import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { BadgeCheck, Check, Plus, Search, UserPlus, X, XCircle } from "lucide-react";
import { useState } from "react";
import { playerQuery, roleLabels, type Player } from "@/api/players";
import { invitesForPlayerQuery } from "@/api/teams";
import { useAuth } from "@/auth/AuthProvider";
import { StoredImage } from "@/components/avatars";
import { CreateTeamDialog } from "@/components/CreateTeamDialog";
import { Page, Panel, SectionTitle } from "@/components/layout";
import { useRespondToInvite } from "@/components/NotificationsButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, EmptyState, PageSpinner } from "@/components/ui/misc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditProfile } from "@/features/player/EditProfile";
import { InviteDialog } from "@/features/player/InviteDialog";
import { formatDate, formatRelative } from "@/lib/format";
import { steamProfileUrl } from "@/lib/steam";

const tabs = ["profile", "teams", "edit"] as const;
type Tab = (typeof tabs)[number];

export const Route = createFileRoute("/players/$playertag")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } => ({
    tab: tabs.includes(search.tab as Tab) ? (search.tab as Tab) : undefined,
  }),
  loader: async ({ context, params }) => {
    const player = await context.queryClient.ensureQueryData(playerQuery(params.playertag));
    if (!player) throw notFound();
  },
  pendingComponent: PageSpinner,
  component: PlayerPage,
});

function TeamGrid({ player }: { player: Player }) {
  const [search, setSearch] = useState("");
  const teams = player.teams.filter((team) => team.name.toLowerCase().includes(search.trim().toLowerCase()));

  if (player.teams.length === 0) return <EmptyState title="Ikke på nogle hold endnu" />;

  return (
    <div className="flex flex-col gap-4">
      {player.teams.length > 8 && (
        <Input icon={<Search />} placeholder="Søg efter hold..." value={search} onChange={(e) => setSearch(e.target.value)} />
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {teams.map((team) => (
          <Link key={team.id} to="/teams/$teamId" params={{ teamId: String(team.id) }} className="group flex flex-col items-center gap-2 text-center">
            <StoredImage src={team.avatarUrl} fallback="team" alt="" className="aspect-square w-full border-2 border-white/10 transition group-hover:border-primary" />
            <span className="heading text-xs group-hover:text-primary">{team.name}</span>
            {team.ownerId === player.id && <Badge tone="primary">Ejer</Badge>}
          </Link>
        ))}
      </div>
    </div>
  );
}

function PendingInvites({ playerId }: { playerId: string }) {
  const { data: invites = [] } = useQuery(invitesForPlayerQuery(playerId));
  const respond = useRespondToInvite();
  const pending = invites.filter((invite) => invite.status === "PENDING");

  return (
    <section>
      <SectionTitle>Holdinvitationer ({pending.length})</SectionTitle>
      {pending.length === 0 ? (
        <p className="text-sm text-muted">Du har ingen ventende invitationer.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {pending.map((invite) => (
            <Panel key={invite.id} className="flex items-center gap-3 p-2">
              <Link to="/teams/$teamId" params={{ teamId: String(invite.team.id) }}>
                <StoredImage src={invite.team.avatarUrl} fallback="team" alt="" className="size-12" />
              </Link>
              <div className="min-w-0 flex-1 text-xs">
                <Link to="/teams/$teamId" params={{ teamId: String(invite.team.id) }} className="heading block truncate text-sm hover:text-primary">
                  {invite.team.name}
                </Link>
                <p className="text-muted">
                  Inviteret af{" "}
                  <Link to="/players/$playertag" params={{ playertag: invite.sender.playertag }} className="hover:text-primary">
                    {invite.sender.playertag}
                  </Link>
                </p>
                <p className="text-muted">{formatRelative(invite.createdAt)}</p>
              </div>
              <Button size="icon" variant="ghost" className="text-success hover:text-success" aria-label="Acceptér" disabled={respond.isPending} onClick={() => respond.mutate({ inviteId: invite.id, accept: true })}>
                <Check />
              </Button>
              <Button size="icon" variant="ghost" className="text-accent hover:text-accent" aria-label="Afvis" disabled={respond.isPending} onClick={() => respond.mutate({ inviteId: invite.id, accept: false })}>
                <X />
              </Button>
            </Panel>
          ))}
        </div>
      )}
    </section>
  );
}

function ProfileTab({ player, isMe }: { player: Player; isMe: boolean }) {
  const { userId, requestLogin } = useAuth();
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 sm:flex-row">
        <StoredImage src={player.avatarUrl} fallback="player" alt={player.playertag} className="aspect-square w-40 border-2 border-white/10 sm:w-52" />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 py-2">
          <div>
            {player.steamId ? (
              <a href={steamProfileUrl(player.steamId)} target="_blank" rel="noreferrer" className="heading inline-flex items-center gap-1 text-xs text-success hover:underline">
                <BadgeCheck className="size-4" /> Steam verificeret
              </a>
            ) : (
              <span className="heading inline-flex items-center gap-1 text-xs text-danger">
                <XCircle className="size-4" /> Ikke Steam verificeret
              </span>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold sm:text-4xl">{player.playertag}</h1>
              {player.role !== "USER" && <Badge tone="warning">{roleLabels[player.role]}</Badge>}
            </div>
            {player.description && <p className="mt-3 max-w-prose whitespace-pre-wrap text-foreground/90">{player.description}</p>}
          </div>
          <p className="heading text-xs text-muted">Bruger siden {formatDate(player.createdAt)}</p>
        </div>
        {!isMe && (
          <div className="flex sm:flex-col">
            <Button variant="outline" onClick={() => (userId ? setInviteOpen(true) : requestLogin("login"))}>
              <UserPlus /> Inviter til hold
            </Button>
          </div>
        )}
      </div>
      <section>
        <SectionTitle>Hold ({player.teams.length})</SectionTitle>
        <TeamGrid player={player} />
      </section>
      {!isMe && <InviteDialog player={player} open={inviteOpen} onOpenChange={setInviteOpen} />}
    </div>
  );
}

function PlayerPage() {
  const { playertag } = Route.useParams();
  const { tab = "profile" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { userId } = useAuth();
  const { data: player } = useQuery(playerQuery(playertag));
  const { data: invites = [] } = useQuery({ ...invitesForPlayerQuery(userId ?? ""), enabled: !!userId && player?.id === userId });
  const [createOpen, setCreateOpen] = useState(false);

  if (!player) return <PageSpinner />;

  const isMe = player.id === userId;
  const activeTab = tab === "edit" && !isMe ? "profile" : tab;
  const hasPendingInvites = isMe && invites.some((invite) => invite.status === "PENDING");

  return (
    <Page>
      <Tabs value={activeTab} onValueChange={(value) => navigate({ search: { tab: value === "profile" ? undefined : (value as Tab) }, replace: true })}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="teams">
            Hold
            {hasPendingInvites && <span className="ml-1.5 inline-block size-2 rounded-full bg-accent align-middle" />}
          </TabsTrigger>
          {isMe && <TabsTrigger value="edit">Rediger</TabsTrigger>}
        </TabsList>
        <TabsContent value="profile">
          <ProfileTab player={player} isMe={isMe} />
        </TabsContent>
        <TabsContent value="teams" className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="heading text-2xl text-primary">{player.playertag}</h1>
            {isMe && (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus /> Opret hold
              </Button>
            )}
          </div>
          {isMe && <PendingInvites playerId={player.id} />}
          <section>
            <SectionTitle>Hold ({player.teams.length})</SectionTitle>
            <TeamGrid player={player} />
          </section>
        </TabsContent>
        {isMe && (
          <TabsContent value="edit">
            <EditProfile player={player} />
          </TabsContent>
        )}
      </Tabs>
      <CreateTeamDialog open={createOpen} onOpenChange={setCreateOpen} />
    </Page>
  );
}
