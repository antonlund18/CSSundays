import * as React from "react";
import {Menu, MenuItem, Typography} from "@material-ui/core";
import {useNavigate} from "react-router-dom";
import {useMutateUser} from "../../hooks/api/useUser";
import {User} from "../../codegen/generated-types";

interface PlayerDropdownProps {
    player: User
    closeDropdown: () => void,
    anchorEl: HTMLElement | null,
}

export const PlayerDropdown = (props: PlayerDropdownProps): JSX.Element => {
    const {logOutUser} = useMutateUser();
    const navigate = useNavigate();

    return <Menu open={!!props.anchorEl}
                 anchorEl={props.anchorEl}
                 getContentAnchorEl={null}
                 anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'right',
                 }}
                 transformOrigin={{
                     vertical: 'top',
                     horizontal: 'right',
                 }}
                 onClose={() => props.closeDropdown()}
    >
        <MenuItem onClick={() => {
            navigate("/players/" + props.player.id);
            props.closeDropdown()
        }}>
            <Typography>Profil</Typography>
        </MenuItem>
        <MenuItem onClick={() => {
            logOutUser();
            props.closeDropdown()
        }}>
            <Typography>Log ud</Typography>
        </MenuItem>
    </Menu>
}