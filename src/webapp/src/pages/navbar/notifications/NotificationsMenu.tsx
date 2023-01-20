import * as React from "react";
import {useCallback, useMemo} from "react";
import {Menu} from "@material-ui/core";
import {useRelativeTimeFormat} from "../../../hooks/useRelativeTimeFormat";
import {InviteToTeamNotification} from "./InviteToTeamNotification";
import {InviteToTeam, Notification} from "../../../codegen/generated-types";

interface NotificationsMenuProps {
    open: boolean
    handleClose: (open: boolean) => void
    notifications: Notification[]
    anchor: HTMLElement | null
}

export const NotificationsMenu = (props: NotificationsMenuProps): JSX.Element => {
    const {formatDateRelatively} = useRelativeTimeFormat();

    const formattedDate = useCallback((timestamp: Date | string | number) => {
        return formatDateRelatively(timestamp)
    }, [])

    const notificationsSortedByCreatedTs = useMemo(() => props.notifications.slice()
        .sort((a, b) => new Date(b.createdTs).valueOf() - new Date(a.createdTs).valueOf()
        ), [props.notifications]);

    return <Menu open={props.open}
                 anchorEl={props.anchor}
                 getContentAnchorEl={null}
                 onClose={() => props.handleClose(false)}
                 anchorOrigin={{
                     vertical: "bottom",
                     horizontal: "right"
                 }}
                 transformOrigin={{
                     vertical: "top",
                     horizontal: "right"
                 }}
    >
        {notificationsSortedByCreatedTs.map((notification, index) => {
            return <InviteToTeamNotification invite={notification.notifiableObject as InviteToTeam} endDivider={index < notificationsSortedByCreatedTs.length - 1} timeAgoText={formattedDate(notification.createdTs)}/>
        })}
    </Menu>
}
