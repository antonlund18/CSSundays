import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { linkSteam } from "@/api/players";
import { useAuth } from "@/auth/AuthProvider";
import { Page } from "@/components/layout";
import { Spinner } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";

// Steam redirects back here with signed openid.* parameters; the API verifies them with Steam.
export const Route = createFileRoute("/steam/callback")({
  component: SteamCallback,
});

function SteamCallback() {
  const { userId, loading, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const started = useRef(false);

  useEffect(() => {
    if (loading || !profile || started.current) return;
    started.current = true;

    const params = Object.fromEntries(
      [...new URLSearchParams(window.location.search)].filter(([key]) => key.startsWith("openid.")),
    );
    const done = () =>
      navigate({ to: "/players/$playertag", params: { playertag: profile.playertag }, search: { tab: "edit" }, replace: true });

    if (params["openid.mode"] !== "id_res") {
      toast.error("Steam verifikation blev afbrudt");
      done();
      return;
    }

    linkSteam(params)
      .then(() => {
        toast.success("Verificeret med Steam");
        queryClient.invalidateQueries({ queryKey: ["player"] });
        queryClient.invalidateQueries({ queryKey: ["me"] });
      })
      .catch((error) => toast.error(errorMessage(error, "Steam verifikation mislykkedes")))
      .finally(done);
  }, [loading, profile, navigate, queryClient]);

  if (!loading && !userId) {
    return (
      <Page>
        <p className="text-center text-muted">Log ind for at verificere din Steam-konto.</p>
      </Page>
    );
  }

  return (
    <Page>
      <div className="flex flex-col items-center gap-3 py-12">
        <Spinner className="size-8" />
        <p className="heading text-sm text-muted">Verificerer Steam-konto...</p>
      </div>
    </Page>
  );
}
