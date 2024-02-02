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

    return <Grid container sx={{
        height: "100%",
    }}>
        <Grid item xs={12}
              style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <Typography variant={"h1"}>Kamp overstået</Typography>
            <div>
                <Typography variant={"h2"} color={state.winTeamOne ? "primary" : "error"}
                            style={{display: "inline-flex", textTransform: "none"}}>
                    {state.winTeamOne ? match.tournamentRegistration1?.team.name : match.tournamentRegistration2?.team.name}
                </Typography>
                <Typography variant={"h2"} style={{display: "inline-flex", whiteSpace: "pre", textTransform: "none"}}>
                    {" vinder"}
                </Typography>
            </div>
        </Grid>
        <Grid item xs={4} style={{display: "flex", alignItems: "center", overflow: "hidden", justifyContent: "flex-end"}}>
            <img src={getPictureLinkFromKey(match.tournamentRegistration1?.team.picture ?? "", ObjectType.Team)}
                 style={{
                     width: "40%",
                     aspectRatio: "1/1",
                     objectFit: "cover",
                     marginRight: "16px"
                 }}/>
            <Typography variant={"subtitle1"}
                        style={{textTransform: "none"}}
                        color={"primary"}>{match.tournamentRegistration1?.team.name}</Typography>
        </Grid>
        <Grid item xs={4} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Typography variant={state.winTeamOne ? "h1" : "h2"} style={{marginRight: "8px",}}>7</Typography>
            <Typography variant={"h2"} style={{marginRight: "8px"}}>-</Typography>
            <Typography variant={state.winTeamOne ? "h2" : "h1"}>13</Typography>
        </Grid>
        <Grid item xs={4}
              style={{display: "flex", alignItems: "center", overflow: "hidden"}}>
            <Typography variant={"subtitle1"}
                        style={{textTransform: "none"}}
                        color={"error"}>{match.tournamentRegistration2?.team.name}</Typography>
            <img src={getPictureLinkFromKey(match.tournamentRegistration2?.team.picture ?? "", ObjectType.Team)}
                 style={{
                     width: "40%",
                     aspectRatio: "1/1",
                     objectFit: "cover",
                     marginLeft: "16px"
                 }}/>
        </Grid>
    </Grid>
}