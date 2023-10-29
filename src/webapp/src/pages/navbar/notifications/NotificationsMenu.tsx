import * as React from "react";
import {useCallback, useMemo} from "react";
import {Menu} from "@material-ui/core";
import {useDateFormatter} from "../../../hooks/useDateFormatter";
import {InviteToTeamNotification} from "./InviteToTeamNotification";
import {InviteToTeam, Notification} from "../../../codegen/generated-types";
import {EmptyState} from "./EmptyState";

interface NotificationsMenuProps {
    open: boolean
    handleClose: (open: boolean) => void
    notifications: Notification[]
    anchor: HTMLElement | null
}

export const NotificationsMenu = (props: NotificationsMenuProps): JSX.Element => {
    const {formatDateRelatively} = useDateFormatter();

    const formattedDate = useCallback((timestamp: Date | string | number) => {
        return formatDateRelatively(timestamp)
    }, [])

    const notificationsSortedByCreatedTs = useMemo(() => props.notifications.slice()
        .sort((a, b) => new Date(b.createdTs).valueOf() - new Date(a.createdTs).valueOf()
        ), [props.notifications]);

    return <Menu open={props.open}
                 PaperProps={{
                     style: {
                         width: "300px",
                         maxHeight: "400px"
                     }
                 }}
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
        {props.notifications.length === 0 ? <EmptyState/> :
            notificationsSortedByCreatedTs.map((notification, index) => {
                return <InviteToTeamNotification invite={notification.notifiableObject as InviteToTeam}
                                                 endDivider={index < notificationsSortedByCreatedTs.length - 1}
                                                 timeAgoText={formattedDate(notification.createdTs)}/>
            })}
    </Menu>
}
