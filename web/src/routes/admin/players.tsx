import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { allPlayersQuery, roleLabels, setUserRole, type UserRole } from "@/api/players";
import { useAuth } from "@/auth/AuthProvider";
import { StoredImage } from "@/components/avatars";
import { Page, PageTitle } from "@/components/layout";
import { Input, Select } from "@/components/ui/input";
import { PageSpinner } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/players")({
  component: AdminPlayersPage,
});

function AdminPlayersPage() {
  const { isAdmin, userId } = useAuth();
  const queryClient = useQueryClient();
  const { data: players, isPending } = useQuery(allPlayersQuery());
  const [search, setSearch] = useState("");
  const changeRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => setUserRole(id, role),
    onSuccess: () => {
      toast.success("Rolle opdateret");
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["player"] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (!isAdmin) {
    return (
      <Page>
        <p className="text-center text-muted">Kun administratorer kan ændre roller.</p>
      </Page>
    );
  }

  const rows = (players ?? []).filter((player) => player.playertag.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <Page>
      <PageTitle subtitle="Arrangører kan administrere turneringer og kampe. Administratorer kan også ændre roller.">Spillere</PageTitle>
      <Input icon={<Search />} placeholder="Søg efter spiller..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
      {isPending ? (
        <PageSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="heading text-xs text-muted">
              <tr className="border-b border-border">
                <th className="px-3 py-3">Spiller</th>
                <th className="hidden px-3 py-3 sm:table-cell">Steam</th>
                <th className="hidden px-3 py-3 sm:table-cell">Oprettet</th>
                <th className="px-3 py-3">Rolle</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((player) => (
                <tr key={player.id} className="border-b border-border/60">
                  <td className="px-3 py-2">
                    <Link to="/players/$playertag" params={{ playertag: player.playertag }} className="flex items-center gap-3 font-bold hover:text-primary">
                      <StoredImage src={player.avatarUrl} fallback="player" alt="" className="size-8" rounded />
                      {player.playertag}
                    </Link>
                  </td>
                  <td className="hidden px-3 py-2 sm:table-cell">{player.steamId && <BadgeCheck className="size-4 text-success" />}</td>
                  <td className="hidden px-3 py-2 sm:table-cell">{formatDate(player.createdAt)}</td>
                  <td className="px-3 py-2">
                    <Select
                      value={player.role}
                      disabled={changeRole.isPending || player.id === userId}
                      onChange={(e) => changeRole.mutate({ id: player.id, role: e.target.value as UserRole })}
                      className="h-8 w-36"
                      aria-label={`Rolle for ${player.playertag}`}
                    >
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
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
