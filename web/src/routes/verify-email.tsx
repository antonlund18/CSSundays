import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { verifyEmail } from "@/api/auth";
import { Page } from "@/components/layout";
import { Spinner } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";

// The confirmation e-mail links here with a one-time token; confirming also logs the player in.
export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(token ? null : "Linket er ugyldigt.");
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    verifyEmail(token)
      .then(() => {
        toast.success("Din e-mail er bekræftet. Velkommen til CSSundays!");
        navigate({ to: "/", replace: true });
      })
      .catch((verifyError) => setError(errorMessage(verifyError)));
  }, [token, navigate]);

  return (
    <Page className="mx-auto max-w-md text-center">
      {error ? (
        <>
          <p className="heading text-xl">Bekræftelse mislykkedes</p>
          <p className="mt-2 text-muted">{error} Linket kan være udløbet – log ind for at få tilsendt et nyt.</p>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 py-8">
          <Spinner className="size-8" />
          <p className="heading text-sm text-muted">Bekræfter din e-mail...</p>
        </div>
      )}
    </Page>
  );
}
