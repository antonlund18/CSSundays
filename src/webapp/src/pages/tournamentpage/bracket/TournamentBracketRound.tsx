import {Box, Theme} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {Match} from "../../../codegen/generated-types";
import {useCallback, useContext, useEffect, useMemo} from "react";
import {TournamentBracketMatchSpacer} from "./TournamentBracketMatchSpacer";
import {ConnectorAfter, TournamentBracketMatch} from "./TournamentBracketMatch";
import {useGetMatchesByParentIds} from "../../../hooks/api/useTournament";
import {Constants} from "../../../util/Constants";
import {BracketContext} from "../tabs/BracketContextProvider";

interface StylesProps {
    isFirstRound: boolean
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    round: props => ({
        display: "flex",
        flexDirection: "column",
        width: Constants.TOURNAMENT_MATCH_WIDTH,
        marginLeft: props.isFirstRound ? 0 : 100
    })
}))

interface TournamentBracketRound {
    matches: Match[]
    connectorAfter?: ConnectorAfter
    setIsLoading: (loading: boolean) => void
    numberOfRoundsToBeShown: number | null
    currentNumberOfRoundsShown: number
}

export const TournamentBracketRound = (props: TournamentBracketRound): JSX.Element => {
    const {setMaxNumberOfRoundsToBeShown} = useContext(BracketContext)

    const matchIds: number[] = useMemo(() => {
        return props.matches.map(match => match.id).filter((id): id is number => !!id)
    }, [props.matches])

    const {matches: previousRoundMatches} = useGetMatchesByParentIds(matchIds)

    useEffect(() => {
        if (previousRoundMatches?.length === 0) {
            props.setIsLoading(false);
        }
    }, [previousRoundMatches])

    const isFirstRound = previousRoundMatches && !(previousRoundMatches.length > 0)

    const classes = useStyles({isFirstRound});

    if (isFirstRound) {
        setMaxNumberOfRoundsToBeShown(props.currentNumberOfRoundsShown)
    }

    const getConnectorAfter = useCallback((index: number): ConnectorAfter => {
        return index % 2 === 0 ? ConnectorAfter.DOWN : ConnectorAfter.UP
    }, [props.matches])

    if (props.numberOfRoundsToBeShown && props.currentNumberOfRoundsShown > props.numberOfRoundsToBeShown) {
        return <></>
    }

    const isLastRoundToBeShown = props.currentNumberOfRoundsShown === props.numberOfRoundsToBeShown

    return <>
        {(previousRoundMatches && !isFirstRound) &&
            <TournamentBracketRound matches={previousRoundMatches}
                                    setIsLoading={props.setIsLoading}
                                    numberOfRoundsToBeShown={props.numberOfRoundsToBeShown}
                                    currentNumberOfRoundsShown={props.currentNumberOfRoundsShown + 1}
            />}
        <Box className={classes.round}>
            <TournamentBracketMatchSpacer halfGrow/>
            {props.matches.map((match, index) => {
                    return <>
                        <TournamentBracketMatch key={match.id} match={match}
                                                connectorBefore={!isFirstRound && !isLastRoundToBeShown}
                                                connectorAfter={props.connectorAfter ?? getConnectorAfter(index)}/>
                        {index !== props.matches.length - 1 &&
                            <TournamentBracketMatchSpacer hasConnector={index % 2 === 0} padding/>}
                    </>
                }
            )}
            <TournamentBracketMatchSpacer halfGrow padding/>
        </Box>
    </>
}