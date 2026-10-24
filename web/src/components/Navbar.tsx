import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, Plus, Shield, User } from "lucide-react";
import { useState } from "react";
import { logOut } from "@/api/auth";
import { ActivityButton } from "@/components/ActivitySidebar";
import { useAuth } from "@/auth/AuthProvider";
import { StoredImage } from "@/components/avatars";
import { CreateTeamDialog } from "@/components/CreateTeamDialog";
import { Logo } from "@/components/layout";
import { NotificationsButton } from "@/components/NotificationsButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/tournaments", label: "Turneringer" },
  { to: "/teams", label: "Hold" },
  { to: "/search", label: "Søg" },
] as const;

function NavLinks({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  return (
    <nav className={className}>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          activeOptions={{ exact: link.to === "/" }}
          className="heading relative px-4 py-2 text-xs text-muted transition-colors hover:text-white data-[status=active]:text-white"
          activeProps={{ className: "after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary" }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function ProfileMenu() {
  const { profile, isStaff } = useAuth();
  const navigate = useNavigate();
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  if (!profile) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="cursor-pointer rounded-full ring-2 ring-transparent transition hover:ring-primary focus-visible:ring-primary" aria-label="Profilmenu">
            <StoredImage src={profile.avatarUrl} fallback="player" alt={profile.playertag} rounded className="size-10" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{profile.playertag}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => navigate({ to: "/players/$playertag", params: { playertag: profile.playertag } })}>
            <User /> Min profil
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setCreateTeamOpen(true)}>
            <Plus /> Opret hold
          </DropdownMenuItem>
          {isStaff && (
            <DropdownMenuItem onSelect={() => navigate({ to: "/admin" })}>
              <Shield /> Admin side
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => logOut()}>
            <LogOut /> Log ud
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateTeamDialog open={createTeamOpen} onOpenChange={setCreateTeamOpen} />
    </>
  );
}

export function Navbar() {
  const { userId, loading, requestLogin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Menu">
            <Menu />
          </Button>
          <Link to="/" aria-label="CSSundays forside">
            <Logo />
          </Link>
        </div>
        <NavLinks className="hidden items-center md:flex" />
        <div className={cn("flex items-center gap-2", loading && "invisible")}>
          {userId ? (
            <>
              <ActivityButton />
              <NotificationsButton />
              <ProfileMenu />
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => requestLogin("login")}>
                Log ind
              </Button>
              <Button variant="accent" className="hidden sm:inline-flex" onClick={() => requestLogin("register")}>
                Tilmeld
              </Button>
            </>
          )}
        </div>
      </div>
      {mobileOpen && (
        <NavLinks onNavigate={() => setMobileOpen(false)} className="flex flex-col border-t border-white/5 px-2 py-2 md:hidden" />
      )}
    </header>
  );
}
