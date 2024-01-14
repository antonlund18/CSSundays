import * as React from "react";
import {useEffect, useState} from "react";
import {Badge, Icon} from "@mui/material";
import {Notifications} from "@mui/icons-material";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {NavBarMenuItem} from "../NavBarMenuItem";
import {NotificationsMenu} from "./NotificationsMenu";
import {MatchChatMessage, Notification, useOnNewNotificationSubscription} from "../../../codegen/generated-types";
import {useFindAllNotificationsForPlayer, useNotifications} from "../../../hooks/api/useNotifications";
import {Constants} from "../../../util/Constants";

export const NotificationsButton = (): JSX.Element => {
    const {currentUser} = useGetCurrentUser();
    const {markAllNotificationsAsSeenForUser} = useNotifications()
    const {allNotificationsForPlayer: initialNotifications} = useFindAllNotificationsForPlayer(currentUser?.id ?? -1)
    const {data} = useOnNewNotificationSubscription({variables: {userId: currentUser?.id}})
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
    const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<HTMLElement | null>(null);

    const allUnseenNotificationsForPlayer = notifications?.filter(notification => !notification.isSeen);

    useEffect(() => {
        if (!allUnseenNotificationsForPlayer || allUnseenNotificationsForPlayer.length >= 0) {
            document.title = Constants.DOCUMENT_TITLE
            return
        }
        if (allUnseenNotificationsForPlayer.length > 0) {
            document.title = `(${allUnseenNotificationsForPlayer.length}) ${Constants.DOCUMENT_TITLE}`
            return
        }
    }, [allUnseenNotificationsForPlayer])

    useEffect(() => {
        if (initialNotifications) {
            setNotifications(initialNotifications)
        }
    }, [initialNotifications])

    useEffect(() => {
        if (data && !notifications.find(notification => notification.id === data.onNewNotification?.id)) {
            setNotifications([...notifications, data.onNewNotification as Notification])
        }
    }, [data])

    if (!currentUser) {
        return <></>
    }

    const handleOpenNotificationsMenu = (open: boolean, e?: React.MouseEvent<HTMLElement>) => {
        setNotificationsMenuAnchor(e?.currentTarget ?? null);
        setIsNotificationsMenuOpen(open);
        if (currentUser.id) {
            markAllNotificationsAsSeenForUser(currentUser.id)
        }
    }

    return <NavBarMenuItem onClick={(e) => handleOpenNotificationsMenu(!isNotificationsMenuOpen, e)}>
        <Badge badgeContent={allUnseenNotificationsForPlayer?.length ?? 0} color={"secondary"}>
            <Icon>
                <Notifications/>
            </Icon>
        </Badge>
        <NotificationsMenu open={isNotificationsMenuOpen}
                           handleClose={handleOpenNotificationsMenu}
                           anchor={notificationsMenuAnchor}
                           notifications={notifications as Notification[] ?? []}/>
    </NavBarMenuItem>
}