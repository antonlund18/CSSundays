import * as React from "react";
import {useCallback, useMemo} from "react";
import {Menu} from "@material-ui/core";
import {InviteToTeam} from "../../codegen/generated-types";
import {useRelativeTimeFormat} from "../../hooks/useRelativeTimeFormat";
import {InviteToTeamNotification} from "./InviteToTeamNotification";

interface NotificationsMenuProps {
    open: boolean
    handleClose: (open: boolean) => void
    notifications: InviteToTeam[]
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
            return <InviteToTeamNotification invite={notification} endDivider={index < notificationsSortedByCreatedTs.length - 1} timeAgoText={formattedDate(notification.createdTs)}/>
        })}
    </Menu>
}
