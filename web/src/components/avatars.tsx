import { Link } from "@tanstack/react-router";
import { Shield, Trophy, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ImageProps = {
  src: string | null | undefined;
  /** Shown while loading and when there is no picture. */
  fallback: "player" | "team" | "tournament";
  alt: string;
  className?: string;
  rounded?: boolean;
};

const fallbackIcons = { player: User, team: Shield, tournament: Trophy };

/** An uploaded picture with an icon fallback. */
export function StoredImage({ src, fallback, alt, className, rounded }: ImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !!src && failedSrc === src;
  const Icon = fallbackIcons[fallback];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-surface-3 text-muted",
        rounded ? "rounded-full" : "rounded-md",
        className,
      )}
    >
      {src && !failed ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src ?? null)} className="size-full object-cover" />
      ) : (
        <Icon className="size-1/2" aria-label={alt} />
      )}
    </div>
  );
}

export type PlayerSummary = { id: string; playertag: string; avatarUrl: string | null };
export type TeamSummary = { id: number; name: string; avatarUrl: string | null };

export function playerPath(playertag: string) {
  return { to: "/players/$playertag", params: { playertag } } as const;
}

/** Picture tile with the playertag on a strip at the bottom, linking to the profile. */
export function PlayerTile({ player, className, highlight }: { player: PlayerSummary; className?: string; highlight?: boolean }) {
  return (
    <Link
      {...playerPath(player.playertag)}
      className={cn("group block w-20 shrink-0", className)}
      title={player.playertag}
    >
      <div className={cn("relative overflow-hidden rounded-md border-2 transition-colors", highlight ? "border-primary" : "border-white/10 group-hover:border-primary")}>
        <StoredImage src={player.avatarUrl} fallback="player" alt={player.playertag} className="aspect-square w-full rounded-none" />
        <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1 py-0.5 text-center text-[11px] font-bold text-white group-hover:text-primary-light">
          {player.playertag}
        </span>
      </div>
    </Link>
  );
}

export function TeamName({ team, className }: { team: TeamSummary; className?: string }) {
  return (
    <Link to="/teams/$teamId" params={{ teamId: String(team.id) }} className={cn("inline-flex min-w-0 items-center gap-2 hover:text-primary", className)}>
      <StoredImage src={team.avatarUrl} fallback="team" alt="" className="size-7" />
      <span className="truncate font-bold">{team.name}</span>
    </Link>
  );
}
