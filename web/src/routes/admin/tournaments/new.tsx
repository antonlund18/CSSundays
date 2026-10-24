import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { uploadImage } from "@/api/players";
import { createTournament } from "@/api/tournaments";
import { Page, PageTitle } from "@/components/layout";
import { TournamentForm, type TournamentFormValues } from "@/features/admin/TournamentForm";
import { errorMessage } from "@/lib/errors";

export const Route = createFileRoute("/admin/tournaments/new")({
  component: NewTournamentPage,
});

function NewTournamentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: async ({ picture, ...values }: TournamentFormValues) => {
      const id = await createTournament(values);
      if (picture) await uploadImage("TOURNAMENT", picture, id);
      return id;
    },
    onSuccess: () => {
      toast.success("Turneringen er oprettet");
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      navigate({ to: "/admin/tournaments" });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Page>
      <PageTitle>Opret turnering</PageTitle>
      <TournamentForm submitLabel="Opret turnering" busy={create.isPending} onSubmit={(values) => create.mutate(values)} />
    </Page>
  );
}
