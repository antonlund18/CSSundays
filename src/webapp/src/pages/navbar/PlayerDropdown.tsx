import * as React from "react";
import {useState} from "react";
import {Divider, Menu, MenuItem, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useMutateUser} from "../../hooks/api/useUser";
import {User} from "../../codegen/generated-types";
import {CreateTeamDialog} from "../teamspage/CreateTeamDialog";

interface PlayerDropdownProps {
    player: User
    closeDropdown: () => void,
    anchorEl: HTMLElement | null,
}

export const PlayerDropdown = (props: PlayerDropdownProps): JSX.Element => {
    // const isCurrentPlayerAdminOrOrganizer = props.player.role === UserRole.Admin || props.player.role === UserRole.Organizer
    const isCurrentPlayerAdminOrOrganizer = true
    const {logOutUser} = useMutateUser()
    const [createTeamDialogIsOpen, setCreateTeamDialogOpen] = useState(false)
    const navigate = useNavigate();

    return <>
        <Menu open={!!props.anchorEl}
              anchorEl={props.anchorEl}
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
            {isCurrentPlayerAdminOrOrganizer &&
                <MenuItem
                    onClick={() => {
                        navigate("/admin");
                        props.closeDropdown()
                    }}>
                    <Typography>Admin side</Typography>
                </MenuItem>}

            <MenuItem onClick={() => {
                setCreateTeamDialogOpen(true)
                props.closeDropdown()
            }}>
                <Typography>Opret hold</Typography>
            </MenuItem>

            <MenuItem onClick={() => {
                logOutUser();
                props.closeDropdown()
            }}>
                <Typography>Log ud</Typography>
            </MenuItem>
        </Menu>
        <CreateTeamDialog open={createTeamDialogIsOpen} setOpen={setCreateTeamDialogOpen}/>
    </>
}