import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { teamsQuery } from "@/api/teams";
import { useAuth } from "@/auth/AuthProvider";
import { StoredImage } from "@/components/avatars";
import { CreateTeamDialog } from "@/components/CreateTeamDialog";
import { Page, PageTitle } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PageSpinner } from "@/components/ui/misc";
import { winrate } from "@/lib/format";

export const Route = createFileRoute("/teams/")({
  component: TeamsPage,
});

function TeamsPage() {
  const { userId, requestLogin } = useAuth();
  const navigate = useNavigate();
  const { data: teams, isPending } = useQuery(teamsQuery());
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const filtered = (teams ?? []).filter((team) => team.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <Page>
      <PageTitle
        actions={
          <Button onClick={() => (userId ? setCreateOpen(true) : requestLogin("login"))}>
            <Plus /> Opret hold
          </Button>
        }
      >
        Hold
      </PageTitle>
      <Input icon={<Search />} placeholder="Søg efter hold..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
      {isPending ? (
        <PageSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState title="Ingen hold fundet" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="heading text-xs text-muted">
              <tr className="border-b border-border">
                <th className="w-12 px-3 py-3 text-right">#</th>
                <th className="px-3 py-3">Navn</th>
                <th className="hidden px-3 py-3 text-right sm:table-cell">Spillere</th>
                <th className="px-3 py-3 text-right">Wins</th>
                <th className="px-3 py-3 text-right">Losses</th>
                <th className="px-3 py-3 text-right">Winrate</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((team, index) => (
                <tr
                  key={team.id}
                  onClick={() => navigate({ to: "/teams/$teamId", params: { teamId: String(team.id) } })}
                  className="cursor-pointer border-b border-border/60 transition-colors hover:bg-surface-2/60"
                >
                  <td className="heading px-3 py-3 text-right text-muted">{index + 1}.</td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-3">
                      <StoredImage src={team.avatarUrl} fallback="team" alt="" className="size-9" />
                      <span className="heading">{team.name}</span>
                    </span>
                  </td>
                  <td className="hidden px-3 py-3 text-right sm:table-cell">{team.memberCount}</td>
                  <td className="px-3 py-3 text-right font-bold text-success">{team.wins}</td>
                  <td className="px-3 py-3 text-right font-bold text-danger">{team.losses}</td>
                  <td className="px-3 py-3 text-right font-bold">{winrate(team.wins, team.losses)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <CreateTeamDialog open={createOpen} onOpenChange={setCreateOpen} />
    </Page>
  );
}
