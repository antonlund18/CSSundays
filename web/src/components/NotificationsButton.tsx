import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bell, Check, X } from "lucide-react";
import { Popover } from "radix-ui";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  NotificationsChangedSubscription,
  markNotificationsSeen,
  notificationsQuery,
  type AppNotification,
} from "@/api/notifications";
import { respondToInvite } from "@/api/teams";
import { useAuth } from "@/auth/AuthProvider";
import { StoredImage } from "@/components/avatars";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/errors";
import { formatRelative } from "@/lib/format";
import { useLiveInvalidate } from "@/lib/graphql";

const TITLE = "CSSundays";

export function useRespondToInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ inviteId, accept }: { inviteId: number; accept: boolean }) => respondToInvite(inviteId, accept),
    onSuccess: (_, { accept }) => {
      toast.success(accept ? "Du er nu med på holdet" : "Invitation afvist");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

function InviteNotification({ notification }: { notification: AppNotification }) {
  const respond = useRespondToInvite();
  const invite = notification.invite;
  if (!invite) return null;

  return (
    <div className="flex gap-3 px-4 py-3">
      <Link to="/teams/$teamId" params={{ teamId: String(invite.team.id) }}>
        <StoredImage src={invite.team.avatarUrl} fallback="team" alt={invite.team.name} className="size-12" />
      </Link>
      <div className="min-w-0 flex-1 text-sm">
        <p className="break-words">
          <Link to="/players/$playertag" params={{ playertag: invite.sender.playertag }} className="font-bold hover:text-primary">
            {invite.sender.playertag}
          </Link>{" "}
          har inviteret dig til{" "}
          <Link to="/teams/$teamId" params={{ teamId: String(invite.team.id) }} className="font-bold hover:text-primary">
            {invite.team.name}
          </Link>
        </p>
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted italic">
          <span>{formatRelative(notification.createdAt)}</span>
          {invite.status === "PENDING" ? (
            <span className="flex gap-1 not-italic">
              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-success hover:text-success"
                disabled={respond.isPending}
                onClick={() => respond.mutate({ inviteId: invite.id, accept: true })}
                aria-label="Acceptér"
              >
                <Check />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-accent hover:text-accent"
                disabled={respond.isPending}
                onClick={() => respond.mutate({ inviteId: invite.id, accept: false })}
                aria-label="Afvis"
              >
                <X />
              </Button>
            </span>
          ) : (
            <span>{invite.status === "ACCEPTED" ? "Accepteret" : "Afvist"}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationsButton() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useQuery({ ...notificationsQuery(userId ?? ""), enabled: !!userId });
  const unseen = notifications.filter((notification) => !notification.seen).length;

  useLiveInvalidate(NotificationsChangedSubscription, {}, [["notifications"], ["invites"]], !!userId);

  useEffect(() => {
    document.title = unseen > 0 ? `(${unseen}) ${TITLE}` : TITLE;
    return () => {
      document.title = TITLE;
    };
  }, [unseen]);

  const onOpenChange = (open: boolean) => {
    if (open && unseen > 0) {
      markNotificationsSeen().then(() => queryClient.invalidateQueries({ queryKey: ["notifications"] }));
    }
  };

  return (
    <Popover.Root onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifikationer (${unseen} nye)`}>
          <Bell className="size-5!" />
          {unseen > 0 && (
            <span className="absolute top-0.5 right-0.5 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-4 font-bold text-white">
              {unseen}
            </span>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 max-h-[70vh] w-80 overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl shadow-black/50 data-[state=open]:animate-fade-in"
        >
          <div className="heading border-b border-border px-4 py-3 text-xs text-muted">Notifikationer</div>
          {notifications.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="heading">Ingen notifikationer</p>
              <p className="mt-1 text-sm text-muted">
                Vi giver dig besked,
                <br />
                når der sker noget nyt
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <InviteNotification key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
