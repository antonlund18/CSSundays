import {Box, makeStyles, Theme} from "@material-ui/core";
import {Match} from "../../codegen/generated-types";
import {useCallback, useMemo} from "react";
import {TournamentBracketMatchSpacer} from "./TournamentBracketMatchSpacer";
import {ConnectorAfter, TournamentBracketMatch} from "./TournamentBracketMatch";
import {useGetMatchesByParentIds} from "../../hooks/api/useTournament";
import {Constants} from "../../util/Constants";

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
}

export const TournamentBracketRound = (props: TournamentBracketRound): JSX.Element => {
    const matchIds: number[] = useMemo(() => {
        return props.matches.map(match => match.id).filter((id): id is number => !!id)
    }, [props.matches])

    const {matches: previousRoundMatches} = useGetMatchesByParentIds(matchIds)

    const isFirstRound = previousRoundMatches && !(previousRoundMatches.length > 0)
    const classes = useStyles({isFirstRound});

    const getConnectorAfter = useCallback((index: number): ConnectorAfter => {
        return index % 2 === 0 ? ConnectorAfter.DOWN : ConnectorAfter.UP
    }, [props.matches])

    return <>
        {(previousRoundMatches && !isFirstRound) && <TournamentBracketRound matches={previousRoundMatches}/>}
        <Box className={classes.round}>
            <TournamentBracketMatchSpacer halfGrow/>
            {props.matches.map((match, index) => {
                    return <>
                        <TournamentBracketMatch key={match.id} match={match} connectorBefore={!isFirstRound} connectorAfter={props.connectorAfter ?? getConnectorAfter(index)}/>
                        {index !== props.matches.length - 1 && <TournamentBracketMatchSpacer hasConnector={index % 2 === 0} padding/>}
                    </>
                }
            )}
            <TournamentBracketMatchSpacer halfGrow padding/>
        </Box>
    </>
}