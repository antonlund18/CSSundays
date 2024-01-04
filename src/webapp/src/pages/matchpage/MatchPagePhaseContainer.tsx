import * as React from "react"
import {makeStyles} from "@mui/styles";
import {Match, MatchPhaseType} from "../../codegen/generated-types";
import {MatchPagePickAndBanPhase} from "./phases/MatchPagePickAndBanPhase";
import {MatchPageWaitingForTeamsPhase} from "./phases/MatchPageWaitingForTeamsPhase";
import {MatchPageReadyCheckPhase} from "./phases/MatchPageReadyCheckPhase";
import {MatchPageCancelledPhase} from "./phases/MatchPageCancelledPhase";
import { MatchPageInProgressPhase } from "./phases/MatchPageInProgressPhase";

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

    const team1Captain = props.match.tournamentRegistration1?.captain
    const team2Captain = props.match.tournamentRegistration2?.captain

    const getCurrentPhaseComponent = () => {
        switch (props.match.currentPhase.phaseType) {
            case MatchPhaseType.Cancelled:
                return <MatchPageCancelledPhase/>
            case MatchPhaseType.WaitingForTeams:
                return <MatchPageWaitingForTeamsPhase/>
            case MatchPhaseType.ReadyCheck:
                return <MatchPageReadyCheckPhase team1Captain={team1Captain} team2Captain={team2Captain} match={props.match}/>
            case MatchPhaseType.PickAndBan:
                return <MatchPagePickAndBanPhase team1Captain={team1Captain} team2Captain={team2Captain} match={props.match}/>
            case MatchPhaseType.InProgress:
                return <MatchPageInProgressPhase match={props.match}/>
        }
    }

    return <div className={classes.phaseContainer}>
        {getCurrentPhaseComponent()}
    </div>
}