import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  title: ReactNode;
  description?: ReactNode;
  hideHeader?: boolean;
};

export function DialogContent({ className, children, title, description, hideHeader, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl shadow-black/50 outline-none data-[state=open]:animate-fade-in",
          className,
        )}
        {...(description ? {} : { "aria-describedby": undefined })}
        {...props}
      >
        <div className={cn("flex items-start justify-between gap-4 border-b border-border px-6 py-4", hideHeader && "sr-only")}>
          <div>
            <DialogPrimitive.Title className="heading text-lg">{title}</DialogPrimitive.Title>
            {description && <DialogPrimitive.Description className="mt-1 text-sm text-muted">{description}</DialogPrimitive.Description>}
          </div>
        </div>
        {children}
        <DialogPrimitive.Close className="absolute top-3.5 right-3.5 cursor-pointer rounded-md p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
          <X className="size-4" />
          <span className="sr-only">Luk</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-6 py-5", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex justify-end gap-2 border-t border-border px-6 py-4", className)} {...props} />;
}
