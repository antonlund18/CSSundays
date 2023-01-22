import * as React from "react";
import {Divider, Menu, MenuItem, Typography} from "@material-ui/core";
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
                     horizontal: 'left',
                 }}
                 transformOrigin={{
                     vertical: 'top',
                     horizontal: 'left',
                 }}
                 onClose={() => props.closeDropdown()}
    >
        <MenuItem
            onClick={() => {
                navigate("/players/" + props.player.id);
            }}>
            <Typography variant={"button"} style={{textTransform: "none"}}>{props.player.playertag}</Typography>
        </MenuItem>
        <Divider/>
        <MenuItem onClick={() => {
            logOutUser();
            props.closeDropdown()
        }}>
            <Typography>Log ud</Typography>
        </MenuItem>
    </Menu>
}