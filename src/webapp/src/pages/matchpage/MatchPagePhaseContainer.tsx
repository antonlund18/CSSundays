import * as React from "react"
import {useEffect, useState} from "react"
import {makeStyles} from "@mui/styles";
import {
    Match,
    MatchPhase,
    MatchPhaseState,
    MatchPhaseType,
    useOnMatchPhaseChangedSubscription
} from "../../codegen/generated-types";
import {MatchPagePickAndBanPhase} from "./phases/MatchPagePickAndBanPhase";
import {MatchPageWaitingForTeamsPhase} from "./phases/MatchPageWaitingForTeamsPhase";
import {MatchPageReadyCheckPhase} from "./phases/MatchPageReadyCheckPhase";
import {MatchPageCancelledPhase} from "./phases/MatchPageCancelledPhase";
import {MatchPageInProgressPhase} from "./phases/MatchPageInProgressPhase";
import {MatchPageWaitingToStartPhase} from "./phases/MatchPageWaitingToStartPhase";
import {MatchPageFinishedPhase} from "./phases/MatchPageFinishedPhase";

const useStyles = makeStyles(theme => ({
    phaseContainer: {
        width: "100%",
        height: "50vh",
        display: "flex",
        flexDirection: "column"
    }
}))

export type MatchPhaseStateWithType = MatchPhaseState & {
    __typename: string
}

type MatchPagePhaseContainerProps = {
    match: Match
}


export const MatchPagePhaseContainer = (props: MatchPagePhaseContainerProps) => {
    const classes = useStyles()
    const [currentPhase, setCurrentPhase] = useState<MatchPhase>(props.match.currentPhase)
    const {data} = useOnMatchPhaseChangedSubscription({variables: {matchId: props.match.id ?? -1}})

    const team1Captain = props.match.tournamentRegistration1?.captain
    const team2Captain = props.match.tournamentRegistration2?.captain

    useEffect(() => {
        if (data?.onMatchPhaseChanged && data?.onMatchPhaseChanged !== currentPhase) {
            setCurrentPhase(data?.onMatchPhaseChanged as MatchPhase)
        }
    }, [data?.onMatchPhaseChanged])

    const getCurrentPhaseComponent = () => {
        switch (currentPhase.phaseType) {
            case MatchPhaseType.Cancelled:
                return <MatchPageCancelledPhase/>
            case MatchPhaseType.WaitingForTeams:
                return <MatchPageWaitingForTeamsPhase/>
            case MatchPhaseType.ReadyCheck:
                return <MatchPageReadyCheckPhase team1Captain={team1Captain} team2Captain={team2Captain} match={props.match} phase={currentPhase}/>
            case MatchPhaseType.PickAndBan:
                return <MatchPagePickAndBanPhase team1Captain={team1Captain} team2Captain={team2Captain} match={props.match} phase={currentPhase}/>
            case MatchPhaseType.InProgress:
                return <MatchPageInProgressPhase match={props.match} phase={currentPhase}/>
            case MatchPhaseType.WaitingToStart:
                return <MatchPageWaitingToStartPhase/>
            case MatchPhaseType.Finished:
                return <MatchPageFinishedPhase match={props.match} phase={currentPhase}/>
        }
    }

    return <div className={classes.phaseContainer}>
        {getCurrentPhaseComponent()}
    </div>
}