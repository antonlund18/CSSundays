import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, ExternalLink, Info } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { changeEmail, changePassword } from "@/api/auth";
import { unlinkSteam, updateProfile, uploadImage, type Player } from "@/api/players";
import { useAuth } from "@/auth/AuthProvider";
import { ImagePicker } from "@/components/ImagePicker";
import { Panel, SectionTitle } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/misc";
import { errorCode, errorMessage } from "@/lib/errors";
import { startSteamLink, steamProfileUrl } from "@/lib/steam";
import { PASSWORD_REQUIREMENTS, isValidPassword } from "@/lib/validation";

function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string; repeat?: string }>({});
  const [busy, setBusy] = useState(false);

  const close = () => {
    onOpenChange(false);
    setCurrent("");
    setNext("");
    setRepeat("");
    setErrors({});
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found: typeof errors = {};
    if (!isValidPassword(next)) found.next = PASSWORD_REQUIREMENTS;
    if (next !== repeat) found.repeat = "De to kodeord er ikke ens";
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      await changePassword(current, next);
      toast.success("Kodeord ændret");
      close();
    } catch (error) {
      if (errorCode(error) === "INVALID_CREDENTIALS") setErrors({ current: "Forkert kodeord" });
      else toast.error(errorMessage(error, "Der skete en fejl ved skift af kodeord"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => (value ? onOpenChange(true) : close())}>
      <DialogContent title="Skift kodeord" className="max-w-md">
        <form onSubmit={submit}>
          <DialogBody className="flex flex-col gap-4">
            <Field label="Nuværende kodeord" htmlFor="pw-current" error={errors.current}>
              <Input id="pw-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} aria-invalid={!!errors.current} required />
            </Field>
            <Field
              label={
                <span className="inline-flex items-center gap-1">
                  Nyt kodeord
                  <Tooltip content={PASSWORD_REQUIREMENTS}>
                    <Info className="size-3.5" />
                  </Tooltip>
                </span>
              }
              htmlFor="pw-next"
              error={errors.next}
            >
              <Input id="pw-next" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} aria-invalid={!!errors.next} required />
            </Field>
            <Field label="Gentag nyt kodeord" htmlFor="pw-repeat" error={errors.repeat}>
              <Input id="pw-repeat" type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} aria-invalid={!!errors.repeat} required />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={close}>
              Luk
            </Button>
            <Button type="submit" disabled={busy}>
              Gem
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditProfile({ player }: { player: Player }) {
  const { email: currentEmail } = useAuth();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState(player.description);
  const [email, setEmail] = useState(currentEmail ?? "");
  const [emailPassword, setEmailPassword] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["player"] });
    queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      await updateProfile(description.trim());
      if (file) await uploadImage("AVATAR", file);

      const trimmedEmail = email.trim().toLowerCase();
      if (trimmedEmail && trimmedEmail !== currentEmail) {
        await changeEmail(trimmedEmail, emailPassword);
        return { emailChanged: true };
      }
      return { emailChanged: false };
    },
    onSuccess: ({ emailChanged }) => {
      setFile(null);
      setEmailPassword("");
      refresh();
      toast.success(emailChanged ? "Gemt. Bekræft din nye e-mail via linket, vi har sendt." : "Brugeroplysninger gemt");
    },
    onError: (error) =>
      toast.error(errorCode(error) === "INVALID_CREDENTIALS" ? "Forkert kodeord – e-mailen blev ikke ændret." : errorMessage(error)),
  });

  const unlink = useMutation({
    mutationFn: unlinkSteam,
    onSuccess: () => {
      toast.success("Steam-kontoen er fjernet");
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
      <ImagePicker src={player.avatarUrl} fallback="player" file={file} onFileChange={setFile} />
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        <Field label="Brugernavn" htmlFor="edit-playertag" hint="Brugernavnet kan ikke ændres.">
          <Input id="edit-playertag" value={player.playertag} disabled />
        </Field>
        <Field label="E-mail" htmlFor="edit-email">
          <Input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        {email.trim().toLowerCase() !== (currentEmail ?? "") && (
          <Field label="Bekræft med dit kodeord" htmlFor="edit-email-password" hint="Vi sender et bekræftelseslink til den nye e-mail.">
            <Input
              id="edit-email-password"
              type="password"
              autoComplete="current-password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              required
            />
          </Field>
        )}
        <Field label="Beskrivelse" htmlFor="edit-description" hint={`${description.length}/500`}>
          <Textarea id="edit-description" value={description} maxLength={500} rows={3} onChange={(e) => setDescription(e.target.value)} />
        </Field>

        <section>
          <SectionTitle>Steam</SectionTitle>
          <Panel className="flex flex-wrap items-center justify-between gap-3 p-4">
            {player.steamId ? (
              <>
                <span className="inline-flex items-center gap-2 font-bold text-success">
                  <BadgeCheck className="size-5" /> Verificeret
                  <a href={steamProfileUrl(player.steamId)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-normal text-muted hover:text-primary">
                    {player.steamId} <ExternalLink className="size-3" />
                  </a>
                </span>
                <Button variant="ghost" size="sm" disabled={unlink.isPending} onClick={() => unlink.mutate()}>
                  Fjern Steam
                </Button>
              </>
            ) : (
              <>
                <span className="font-bold text-danger">Ikke verificeret</span>
                <Button onClick={startSteamLink} className="bg-[#171a21] text-white hover:bg-[#2a475e]">
                  Verificér med Steam
                </Button>
              </>
            )}
          </Panel>
        </section>

        <div className="flex flex-wrap justify-between gap-2">
          <Button variant="outline" onClick={() => setPasswordOpen(true)}>
            Skift kodeord
          </Button>
          <Button type="submit" disabled={save.isPending}>
            Gem
          </Button>
        </div>
      </form>
      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
    </div>
  );
}
