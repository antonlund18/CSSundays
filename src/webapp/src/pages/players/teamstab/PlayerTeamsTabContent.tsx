import * as React from "react"
import {User} from "../../../codegen/generated-types";
import {Grid, Typography} from "@mui/material";
import {PlayerTeamsTabTeamList} from "./PlayerTeamsTabTeamList";
import {PlayerTeamsTabInviteList} from "./PlayerTeamsTabInviteList";
import {Divider as CSDivider} from "../../../components/Divider";

type PlayerTeamsTabContent = {
    player: User
    isCurrentUser: boolean
}

export const PlayerTeamsTabContent = (props: PlayerTeamsTabContent): JSX.Element => {
    return <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant={"h2"} color={"primary"}>{props.player?.playertag}</Typography>
                <CSDivider/>
            </Grid>
            {props.isCurrentUser && <>
                <Grid item xs={12} style={{height: "168px", marginBottom: "64px"}}>
                    <PlayerTeamsTabInviteList player={props.player}/>
                </Grid>
            </>
            }
            <PlayerTeamsTabTeamList player={props.player}/>
        </Grid>
    </>
}