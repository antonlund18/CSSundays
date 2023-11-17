import * as React from "react"
import {User} from "../../codegen/generated-types";
import {Grid, Typography} from "@mui/material";
import {ProfileTabHeaderSection} from "./ProfileTabHeaderSection";
import {ProfileTabSocialSection} from "./ProfileTabSocialSection";
import {ProfileTabInformationSection} from "./ProfileTabInformationSection";
import {useDateFormatter} from "../../hooks/useDateFormatter";
import { PlayerTeamsTabTeamList } from "./PlayerTeamsTabTeamList";

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