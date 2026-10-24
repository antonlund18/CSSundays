import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/auth/AuthProvider";
import { Page } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/ui/misc";

// Everything under /admin is for admins and organizers. The database enforces
// the same rules, so this guard is only about showing the right screen.
export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, userId, profile, isStaff, requestLogin } = useAuth();
  if (loading || (userId && !profile)) return <PageSpinner />;
  if (!isStaff) {
    return (
      <Page className="text-center">
        <p className="heading text-2xl">Ingen adgang</p>
        <p className="mt-2 text-muted">Denne side er kun for arrangører.</p>
        {!userId && (
          <Button className="mt-4" onClick={() => requestLogin("login")}>
            Log ind
          </Button>
        )}
      </Page>
    );
  }
  return <Outlet />;
}
