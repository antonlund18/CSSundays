import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { uploadImage } from "@/api/players";
import { tournamentQuery, updateTournament } from "@/api/tournaments";
import { Page, PageTitle } from "@/components/layout";
import { PageSpinner } from "@/components/ui/misc";
import { TournamentForm, type TournamentFormValues } from "@/features/admin/TournamentForm";
import { errorMessage } from "@/lib/errors";

export const Route = createFileRoute("/admin/tournaments/$tournamentId")({
  loader: async ({ context, params }) => {
    const id = Number(params.tournamentId);
    if (!Number.isInteger(id)) throw notFound();
    const tournament = await context.queryClient.ensureQueryData(tournamentQuery(id));
    if (!tournament) throw notFound();
  },
  pendingComponent: PageSpinner,
  component: EditTournamentPage,
});

function EditTournamentPage() {
  const { tournamentId } = Route.useParams();
  const id = Number(tournamentId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: tournament } = useQuery(tournamentQuery(id));

  const save = useMutation({
    mutationFn: async ({ picture, ...values }: TournamentFormValues) => {
      await updateTournament(id, values);
      if (picture) await uploadImage("TOURNAMENT", picture, id);
    },
    onSuccess: () => {
      toast.success("Turneringen er gemt");
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["tournament", id] });
      navigate({ to: "/admin/tournaments" });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (!tournament) return <PageSpinner />;

  return (
    <Page>
      <PageTitle>Rediger turnering</PageTitle>
      <TournamentForm initial={tournament} submitLabel="Gem ændringer" busy={save.isPending} onSubmit={(values) => save.mutate(values)} />
    </Page>
  );
}
