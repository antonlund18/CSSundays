import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Content panel on top of the site background (the old "CenteredPage"). */
export function Page({ children, wide, className }: { children: ReactNode; wide?: boolean; className?: string }) {
  return (
    <main className={cn("mx-auto w-full px-4 py-6 sm:px-6 sm:py-10", wide ? "max-w-7xl" : "max-w-6xl")}>
      <div className={cn("rounded-2xl border border-white/5 bg-surface/85 p-5 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8", className)}>
        {children}
      </div>
    </main>
  );
}

/** Page heading with the accent bar underneath. */
export function PageTitle({
  children,
  subtitle,
  actions,
  accent = "primary",
}: {
  children: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  accent?: "primary" | "accent";
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className={cn("heading truncate text-2xl sm:text-3xl", accent === "primary" ? "text-primary" : "text-accent")}>{children}</h1>
          {subtitle && <div className="mt-1 text-sm text-muted">{subtitle}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className="relative mt-3 h-px bg-border">
        <div className={cn("absolute -top-px left-0 h-[3px] w-16 rounded-full", accent === "primary" ? "bg-primary" : "bg-accent")} />
      </div>
    </div>
  );
}

export function SectionTitle({ children, className, actions }: { children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-4", className)}>
      <h2 className="heading text-sm text-muted">{children}</h2>
      {actions}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-border bg-surface-2/50", className)}>{children}</div>;
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("heading text-xl tracking-wider", className)}>
      <span className="text-white">CS</span>
      <span className="text-primary">Sundays</span>
    </span>
  );
}
