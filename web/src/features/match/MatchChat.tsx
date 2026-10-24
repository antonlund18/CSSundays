import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CornerDownLeft } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { chatQuery, sendChatMessage, type MatchDetails } from "@/api/matches";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/errors";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 256;

export function MatchChat({ match, canChat }: { match: MatchDetails; canChat: boolean }) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { data: messages = [] } = useQuery(chatQuery(match.id));
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  const team1 = new Set(match.registration1?.players.map((user) => user.id));
  const team2 = new Set(match.registration2?.players.map((user) => user.id));

  const send = useMutation({
    mutationFn: (message: string) => sendChatMessage(match.id, message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat", match.id] }),
    onError: (error) => toast.error(errorMessage(error, "Beskeden kunne ikke sendes.")),
  });

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages.length]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;
    send.mutate(message);
    setDraft("");
  };

  const placeholder = !userId
    ? "Du skal være logget ind for at sende en besked"
    : !canChat
      ? "Kun spillere i kampen og arrangører kan skrive"
      : "Skriv en besked...";

  return (
    <section>
      <h2 className="heading mb-2 text-sm text-muted">Chat</h2>
      <div className="overflow-hidden rounded-xl border border-border bg-background/60">
        <div ref={scroller} className="h-72 overflow-y-auto px-4 py-3 text-sm">
          <p className="font-bold text-muted">Velkommen til chatten</p>
          {messages.map((message) => (
            <p key={message.id} className="break-words whitespace-pre-wrap">
              <span
                className={cn(
                  "font-bold",
                  team1.has(message.sender.id) ? "text-primary" : team2.has(message.sender.id) ? "text-accent-light" : "text-warning",
                )}
              >
                [{formatTime(message.createdAt)}] {message.sender.playertag}:
              </span>{" "}
              {message.message}
            </p>
          ))}
        </div>
        <form onSubmit={submit} className="flex items-center gap-2 border-t border-border px-3 py-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value.slice(0, MAX_LENGTH))}
            disabled={!canChat}
            placeholder={placeholder}
            autoComplete="off"
            aria-label="Besked"
            className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted disabled:cursor-not-allowed"
          />
          <Button type="submit" variant="ghost" size="icon" disabled={!canChat || !draft.trim()} aria-label="Send besked">
            <CornerDownLeft />
          </Button>
        </form>
      </div>
    </section>
  );
}
