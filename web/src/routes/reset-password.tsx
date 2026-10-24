import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { resetPassword } from "@/api/auth";
import { useAuth } from "@/auth/AuthProvider";
import { Page, PageTitle } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/errors";
import { PASSWORD_REQUIREMENTS, isValidPassword } from "@/lib/validation";

// The password-reset e-mail links here with a one-time token.
export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const { requestLogin } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    if (!isValidPassword(password)) return setError(PASSWORD_REQUIREMENTS);
    if (password !== repeat) return setError("De to kodeord er ikke ens");
    setBusy(true);
    try {
      await resetPassword(token, password);
      toast.success("Dit kodeord er opdateret – log ind med det nye kodeord.");
      navigate({ to: "/" });
      requestLogin("login");
    } catch (resetError) {
      setError(errorMessage(resetError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page className="mx-auto max-w-md">
      <PageTitle>Nyt kodeord</PageTitle>
      {!token ? (
        <p className="text-muted">Linket er ugyldigt. Bed om et nyt via "Glemt kodeord?" i login-vinduet.</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Nyt kodeord" htmlFor="reset-password" hint={PASSWORD_REQUIREMENTS}>
            <Input id="reset-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <Field label="Gentag kodeord" htmlFor="reset-repeat" error={error}>
            <Input id="reset-repeat" type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} required />
          </Field>
          <Button type="submit" disabled={busy}>
            Gem kodeord
          </Button>
        </form>
      )}
    </Page>
  );
}
