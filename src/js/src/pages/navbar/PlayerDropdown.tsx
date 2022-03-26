import * as React from "react";
import {Menu, MenuItem, Typography} from "@material-ui/core";
import {useAuth} from "../../firebase/authentication/AuthContext";
import {Player} from "../../firebase/database/PlayersHandler";
import {useNavigate} from "react-router-dom";

interface PlayerDropdownProps {
    player: Player
    closeDropdown: () => void,
    anchorEl: HTMLElement | null,
}

export const PlayerDropdown = (props: PlayerDropdownProps): JSX.Element => {
    const {auth} = useAuth();
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
            navigate("/players/" + props.player.username);
            props.closeDropdown()
        }}>
            <Typography>Profil</Typography>
        </MenuItem>
        <MenuItem onClick={() => {
            auth?.signOut()
            props.closeDropdown()
        }}>
            <Typography>Log ud</Typography>
        </MenuItem>
    </Menu>
}