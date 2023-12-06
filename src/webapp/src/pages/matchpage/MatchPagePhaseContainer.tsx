import * as React from "react"
import {makeStyles} from "@mui/styles";
import {User} from "../../codegen/generated-types";
import {MatchPageMapPickPhase} from "./phases/MatchPageMapPickPhase";

const useStyles = makeStyles(theme => ({
    phaseContainer: {
        width: "100%",
        height: "50vh",
        display: "flex",
        flexDirection: "column"
    }
}))

type MatchPagePhaseContainerProps = {
    team1Captain: User | undefined
    team2Captain: User | undefined
}

export const MatchPagePhaseContainer = (props: MatchPagePhaseContainerProps) => {
    const classes = useStyles()

    return <div className={classes.phaseContainer}>
        <MatchPageMapPickPhase team1Captain={props.team1Captain} team2Captain={props.team2Captain}/>
    </div>
}