import * as React from "react"
import {User} from "../../../codegen/generated-types";
import {Button, Grid, Typography} from "@mui/material";
import {PlayerTeamsTabTeamList} from "./PlayerTeamsTabTeamList";
import {PlayerTeamsTabInviteList} from "./PlayerTeamsTabInviteList";
import {Divider as CSDivider} from "../../../components/Divider";
import {CreateTeamDialog} from "../../teamspage/CreateTeamDialog";
import {useState} from "react";

type PlayerTeamsTabContent = {
    player: User
    isCurrentUser: boolean
}

export const PlayerTeamsTabContent = (props: PlayerTeamsTabContent): JSX.Element => {
    const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false)

    return <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Typography variant={"h2"} color={"primary"}>{props.player?.playertag}</Typography>
                    {props.isCurrentUser && <Button variant={"contained"} onClick={() => setCreateTeamDialogOpen(true)}>Opret hold</Button>}
                </div>
                <CSDivider/>
            </Grid>
            {props.isCurrentUser && <>
                <Grid item xs={12} style={{height: "168px", marginBottom: "64px"}}>
                    <PlayerTeamsTabInviteList player={props.player}/>
                </Grid>
            </>
            }
            <PlayerTeamsTabTeamList player={props.player}/>
            <CreateTeamDialog open={createTeamDialogOpen} setOpen={setCreateTeamDialogOpen}/>
        </Grid>
    </>
}