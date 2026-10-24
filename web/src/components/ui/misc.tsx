import { Tooltip as TooltipPrimitive } from "radix-ui";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle className={cn("size-6 animate-spin text-primary", className)} aria-label="Indlæser" />;
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

const badgeTones = {
  neutral: "bg-surface-3 text-foreground",
  primary: "bg-primary/15 text-primary",
  accent: "bg-accent/15 text-accent-light",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  warning: "bg-warning/15 text-warning",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: keyof typeof badgeTones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap [&_svg]:size-3",
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function Tooltip({ content, children, side = "top" }: { content: ReactNode; children: ReactNode; side?: "top" | "right" | "bottom" | "left" }) {
  return (
    <TooltipPrimitive.Root delayDuration={200}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className="z-50 max-w-64 rounded-md bg-surface-3 px-2.5 py-1.5 text-xs text-foreground shadow-lg data-[state=delayed-open]:animate-fade-in"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-surface-3" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export const TooltipProvider = TooltipPrimitive.Provider;

/** Empty-state block used across lists. */
export function EmptyState({ title, children, className }: { title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-12 text-center", className)}>
      <p className="heading text-muted">{title}</p>
      {children && <div className="text-sm text-muted">{children}</div>}
    </div>
  );
}
