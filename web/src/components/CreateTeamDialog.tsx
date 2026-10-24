import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/api/players";
import { createTeam } from "@/api/teams";
import { useAuth } from "@/auth/AuthProvider";
import { ImagePicker } from "@/components/ImagePicker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/errors";
import { isValidTeamName } from "@/lib/validation";

export function CreateTeamDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const close = () => {
    onOpenChange(false);
    setName("");
    setFile(null);
    setError(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!userId) return;
    if (!isValidTeamName(name)) {
      setError("Dit holdnavn skal være mellem 2 og 32 tegn");
      return;
    }
    setBusy(true);
    try {
      const teamId = await createTeam(name.trim());
      if (file) {
        try {
          await uploadImage("TEAM", file, teamId);
        } catch (uploadError) {
          toast.error(errorMessage(uploadError, "Holdet blev oprettet, men billedet kunne ikke uploades."));
        }
      }
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      queryClient.invalidateQueries({ queryKey: ["player"] });
      toast.success("Holdet er oprettet");
      close();
      navigate({ to: "/teams/$teamId", params: { teamId: String(teamId) } });
    } catch (createError) {
      setError(errorMessage(createError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent title="Opret hold" className="max-w-sm">
        <form onSubmit={submit}>
          <DialogBody className="flex flex-col gap-5">
            <ImagePicker src={null} fallback="team" file={file} onFileChange={setFile} className="mx-auto w-40" />
            <Field label="Holdnavn" htmlFor="team-name" error={error}>
              <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={32} aria-invalid={!!error} autoFocus />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={close}>
              Luk
            </Button>
            <Button type="submit" disabled={busy}>
              Opret
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
