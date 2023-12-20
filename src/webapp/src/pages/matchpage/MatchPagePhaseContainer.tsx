import * as React from "react"
import {makeStyles} from "@mui/styles";
import {Match, MatchPhaseType} from "../../codegen/generated-types";
import {MatchPagePickAndBanPhase} from "./phases/MatchPagePickAndBanPhase";
import {MatchPageWaitingForTeamsPhase} from "./phases/MatchPageWaitingForTeamsPhase";

const useStyles = makeStyles(theme => ({
    phaseContainer: {
        width: "100%",
        height: "50vh",
        display: "flex",
        flexDirection: "column"
    }
}))

type MatchPagePhaseContainerProps = {
    match: Match
}

export const MatchPagePhaseContainer = (props: MatchPagePhaseContainerProps) => {
    const classes = useStyles()

    const team1Captain = props.match.team1?.users[0]
    const team2Captain = props.match.team2?.users[0]

    const getCurrentPhaseComponent = () => {
        switch (props.match.phase.phase) {
            case MatchPhaseType.WaitingForTeams:
                return <MatchPageWaitingForTeamsPhase/>
            case MatchPhaseType.PickAndBan:
                return <MatchPagePickAndBanPhase team1Captain={team1Captain} team2Captain={team2Captain}/>
        }
    }

    return <div className={classes.phaseContainer}>
        {getCurrentPhaseComponent()}
    </div>
}