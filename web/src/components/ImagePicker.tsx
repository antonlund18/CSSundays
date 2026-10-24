import { ImageUp } from "lucide-react";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { StoredImage } from "@/components/avatars";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/upload";
import { cn } from "@/lib/utils";

type ImagePickerProps = {
  /** Current picture URL, shown until a new file is chosen. */
  src: string | null | undefined;
  fallback: "player" | "team" | "tournament";
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
  label?: ReactNode;
};

/** Click-to-choose picture with a local preview. Uploading is up to the caller. */
export function ImagePicker({ src, fallback, file, onFileChange, disabled, className, label = "Skift billede" }: ImagePickerProps) {
  const input = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => input.current?.click()}
        className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border-2 border-white/10 disabled:cursor-default"
      >
        {preview ? (
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          <StoredImage src={src} fallback={fallback} alt="" className="size-full rounded-none" />
        )}
        {!disabled && (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 text-sm font-bold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <ImageUp className="size-6" />
            {label}
          </span>
        )}
      </button>
      <input
        ref={input}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="hidden"
        onChange={(event) => {
          const chosen = event.target.files?.[0] ?? null;
          event.target.value = "";
          if (chosen && chosen.size > MAX_IMAGE_BYTES) {
            toast.error("Billedet må højst fylde 2 MB.");
            return;
          }
          onFileChange(chosen);
        }}
      />
    </div>
  );
}
