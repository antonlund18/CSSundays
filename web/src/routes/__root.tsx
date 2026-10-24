import type { QueryClient } from "@tanstack/react-query";
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ActivitySidebar } from "@/components/ActivitySidebar";
import { LoginDialog } from "@/components/LoginDialog";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/misc";
import { errorMessage } from "@/lib/errors";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: ({ error }) => (
    <Centered title="Noget gik galt" text={errorMessage(error)}>
      <Button onClick={() => window.location.reload()}>Prøv igen</Button>
    </Centered>
  ),
});

function RootLayout() {
  return (
    <TooltipProvider>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgb(8 17 42 / 0.55), rgb(8 17 42 / 0.85)), url(/background.png)" }}
      />
      <Navbar />
      <div className="flex">
        <ActivitySidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
      <LoginDialog />
      <Toaster theme="dark" position="bottom-center" richColors closeButton />
    </TooltipProvider>
  );
}

function Centered({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="heading text-7xl text-primary">{title}</h1>
      <p className="heading text-sm text-muted">{text}</p>
      {children}
    </div>
  );
}

function NotFound() {
  return (
    <Centered title="404" text="Denne side findes ikke">
      <Button asChild variant="outline">
        <Link to="/">Til forsiden</Link>
      </Button>
    </Centered>
  );
}
