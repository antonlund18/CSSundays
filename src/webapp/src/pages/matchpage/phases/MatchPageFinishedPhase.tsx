import * as React from "react"
import {Grid, Typography} from "@mui/material";
import {Match, MatchFinishedPhaseState, MatchPhase, ObjectType} from "../../../codegen/generated-types";
import {MatchPhaseStateWithType} from "../MatchPagePhaseContainer";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";

type MatchPageFinishedPhaseProps = {
    match: Match
    phase: MatchPhase
}

export const MatchPageFinishedPhase = (props: MatchPageFinishedPhaseProps) => {
    const {match, phase} = props

    if ((phase.state as MatchPhaseStateWithType).__typename !== "MatchFinishedPhaseState") {
        return <></>
    }

    const state = phase.state as MatchFinishedPhaseState

    const winningRegistration = state.winTeamOne ? match.tournamentRegistration1 : match.tournamentRegistration2
    const winningTeam = winningRegistration?.team

    return <Grid container sx={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column"
    }}>
        <Typography variant={"h1"}>Kamp overstået</Typography>
        <Typography variant={"h2"} style={{marginTop: "16px"}}>Vinder</Typography>
        <img src={getPictureLinkFromKey(winningTeam?.picture ?? "", ObjectType.Team)} style={{
            width: "200px",
            aspectRatio: "1/1",
            objectFit: "cover",
        }}/>
        <Typography variant={"subtitle1"}
                    color={state.winTeamOne ? "primary" : "error"}>{winningTeam?.name}</Typography>
    </Grid>
}