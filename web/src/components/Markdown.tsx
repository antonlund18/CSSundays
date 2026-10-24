import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/** Renders tournament descriptions and rules. Raw HTML is not allowed. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-cs text-sm", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
