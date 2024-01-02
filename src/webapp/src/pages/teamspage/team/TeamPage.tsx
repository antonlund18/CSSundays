import * as React from "react";
import {useParams} from "react-router-dom";
import {CenteredPage} from "../../../components/CenteredPage";
import {Grid, Typography} from "@mui/material";
import {Divider as CSDivider} from "../../../components/Divider";
import {useGetTeamById} from "../../../hooks/api/useTeam";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {TeamInfo} from "./TeamInfo";
import {TeamPlayersContainer} from "./TeamPlayersContainer";
import {TeamStatsContainer} from "./TeamStatsContainer";

export const TeamPage = (): JSX.Element => {
    const urlParams = useParams();

    const {team} = useGetTeamById(parseInt(urlParams.teamId ?? ""))

    if (team === null) {
        return <CenteredPage/>
    }

    return <CenteredPage>
        <Grid container
              direction={"row"}
              justifyContent={"center"}
              alignItems={"stretch"}
              spacing={4}
        >
            <Grid item xs={12}>
                <Typography variant={"h2"} color={"primary"}>{team?.name}</Typography>
                <CSDivider/>
            </Grid>
            <Grid item xs={12} md={4}>
                <TeamInfo team={team!}/>
            </Grid>
            <Grid item xs={12} md={8}>
                <TeamPlayersContainer team={team}/>
                <TeamStatsContainer team={team}/>
            </Grid>
        </Grid>
    </CenteredPage>
}