import * as React from "react";
import {useState} from "react";
import {Badge, Icon} from "@mui/material";
import {Notifications} from "@mui/icons-material";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {NavBarMenuItem} from "../NavBarMenuItem";
import {NotificationsMenu} from "./NotificationsMenu";
import {Notification} from "../../../codegen/generated-types";
import {useFindAllNotificationsForPlayer, useNotifications} from "../../../hooks/api/useNotifications";

export const NotificationsButton = (): JSX.Element => {
    const {currentUser} = useGetCurrentUser();
    const {markAllNotificationsAsSeenForUser} = useNotifications()
    const {allNotificationsForPlayer} = useFindAllNotificationsForPlayer(currentUser.id ?? -1)
    const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
    const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<HTMLElement | null>(null);

    const allUnseenInvitesForPlayer = allNotificationsForPlayer?.filter(notification => !notification.isSeen);

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
        <Badge badgeContent={allUnseenInvitesForPlayer?.length ?? 0} color={"secondary"}>
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