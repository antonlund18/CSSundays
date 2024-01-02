import * as React from "react";
import {useEffect, useState} from "react";
import {Badge, Icon} from "@mui/material";
import {Notifications} from "@mui/icons-material";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {NavBarMenuItem} from "../NavBarMenuItem";
import {NotificationsMenu} from "./NotificationsMenu";
import {Notification} from "../../../codegen/generated-types";
import {useFindAllNotificationsForPlayer, useNotifications} from "../../../hooks/api/useNotifications";
import {Constants} from "../../../util/Constants";

export const NotificationsButton = (): JSX.Element => {
    const {currentUser} = useGetCurrentUser();
    const {markAllNotificationsAsSeenForUser} = useNotifications()
    const {allNotificationsForPlayer} = useFindAllNotificationsForPlayer(currentUser?.id ?? -1)
    const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
    const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<HTMLElement | null>(null);

    const allUnseenNotificationsForPlayer = allNotificationsForPlayer?.filter(notification => !notification.isSeen);

    useEffect(() => {
        if (!allUnseenNotificationsForPlayer || allUnseenNotificationsForPlayer.length < 1) {
            document.title = Constants.DOCUMENT_TITLE
            return
        }
        if (allUnseenNotificationsForPlayer.length > 0) {
            document.title = `(${allUnseenNotificationsForPlayer.length}) ${Constants.DOCUMENT_TITLE}`
            return
        }
    }, [allUnseenNotificationsForPlayer])

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
                           notifications={allNotificationsForPlayer as Notification[] ?? []}/>
    </NavBarMenuItem>
}