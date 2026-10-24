import { Link, createFileRoute } from "@tanstack/react-router";
import { Map, Server, Swords, Trophy, Users } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { Page, PageTitle } from "@/components/layout";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

function Tile({ to, title, icon, position }: { to: "/admin/tournaments" | "/admin/players" | "/admin/maps" | "/admin/match-test" | "/admin/servers"; title: string; icon: React.ReactNode; position: string }) {
  return (
    <Link to={to} className="group relative block overflow-hidden rounded-xl border border-border">
      <div
        className="flex h-56 flex-col items-center justify-center gap-2 bg-cover transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: "url(/background.png)", backgroundPosition: position }}
      >
        <span className="text-white [&_svg]:size-8">{icon}</span>
        <span className="heading text-xs text-primary">Rediger</span>
        <span className="heading text-2xl text-white">{title}</span>
      </div>
    </Link>
  );
}

function AdminPage() {
  const { isAdmin } = useAuth();
  return (
    <Page>
      <PageTitle>Admin side</PageTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile to="/admin/tournaments" title="Turneringer" icon={<Trophy />} position="0% 50%" />
        <Tile to="/admin/maps" title="Kort" icon={<Map />} position="50% 50%" />
        {isAdmin && <Tile to="/admin/players" title="Spillere" icon={<Users />} position="100% 50%" />}
        <Tile to="/admin/match-test" title="Test kamp" icon={<Swords />} position="75% 50%" />
        <Tile to="/admin/servers" title="Servere" icon={<Server />} position="25% 50%" />
      </div>
    </Page>
  );
}
