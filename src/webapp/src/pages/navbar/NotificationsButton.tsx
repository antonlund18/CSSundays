import * as React from "react";
import {useState} from "react";
import {Badge, Icon} from "@material-ui/core";
import {Notifications} from "@material-ui/icons";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {NavBarMenuItem} from "./NavBarMenuItem";
import {useFindAllInvitesForPlayer, useFindAllUnseenInvitesForPlayer} from "../../hooks/api/useInviteToTeam";
import {NotificationsMenu} from "./NotificationsMenu";
import {InviteToTeam} from "../../codegen/generated-types";

export const NotificationsButton = (): JSX.Element => {
    const {currentUser} = useGetCurrentUser();
    const {allInvitesForPlayer} = useFindAllInvitesForPlayer(currentUser.id ?? -1)
    const {allUnseenInvitesForPlayer} = useFindAllUnseenInvitesForPlayer(currentUser.id ?? -1)
    const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
    const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<HTMLElement | null>(null);

    if (!currentUser) {
        return <></>
    }

    const handleOpenNotificationsMenu = (open: boolean, e?: React.MouseEvent<HTMLElement>) => {
        setNotificationsMenuAnchor(e?.currentTarget ?? null);
        setIsNotificationsMenuOpen(open);
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
                           notifications={allInvitesForPlayer as InviteToTeam[] ?? []}/>
    </NavBarMenuItem>
}