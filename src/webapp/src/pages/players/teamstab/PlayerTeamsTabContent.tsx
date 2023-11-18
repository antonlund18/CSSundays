import * as React from "react"
import {User} from "../../../codegen/generated-types";
import {Grid} from "@mui/material";
import {PlayerTeamsTabTeamList} from "./PlayerTeamsTabTeamList";

type PlayerTeamsTabContent = {
    player: User
    isCurrentUser: boolean
}

export const PlayerTeamsTabContent = (props: PlayerTeamsTabContent): JSX.Element => {

    return <>
        <Grid container spacing={4}>
            <PlayerTeamsTabTeamList teams={props.player.teams}/>
        </Grid>
    </>
}