import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-md border border-border bg-surface-2/70 px-3 text-sm text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger aria-invalid:focus:ring-danger/30";

type InputProps = ComponentProps<"input"> & { icon?: ReactNode; trailing?: ReactNode };

export function Input({ className, icon, trailing, ...props }: InputProps) {
  if (!icon && !trailing) return <input className={cn(fieldClass, "h-10", className)} {...props} />;
  return (
    <div className={cn("relative", className)}>
      {icon && <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted [&_svg]:size-4">{icon}</span>}
      <input className={cn(fieldClass, "h-10", icon && "pl-9", trailing && "pr-10")} {...props} />
      {trailing && <span className="absolute top-1/2 right-1.5 -translate-y-1/2">{trailing}</span>}
    </div>
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "min-h-24 py-2 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(fieldClass, "h-10 cursor-pointer", className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("heading mb-1.5 block text-xs text-muted", className)} {...props} />;
}

type FieldProps = {
  label: ReactNode;
  htmlFor: string;
  error?: string | false | null;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Field({ label, htmlFor, error, hint, children, className }: FieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
