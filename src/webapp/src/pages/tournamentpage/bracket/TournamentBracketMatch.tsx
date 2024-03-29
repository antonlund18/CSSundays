import {
    Match,
    MatchFinishedPhaseState,
    MatchPhaseType,
    Team,
    TournamentRegistration
} from "../../../codegen/generated-types";
import {Button, Divider, List, ListItem, Theme, Typography} from "@mui/material";
import {makeStyles, useTheme} from "@mui/styles"
import {Constants} from "../../../util/Constants";
import * as React from "react";
import {useCallback} from "react";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {TournamentBracketMatchTeam} from "./TournamentBracketMatchTeam";
import {useNavigate} from "react-router-dom";
import {Property} from "csstype";

interface StylesProps {
    connectorAfter: ConnectorAfter
    connectorBefore: boolean
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    match: props => ({
        border: "1px solid black",
        borderRadius: 0,
        display: "flex",
        textTransform: "none",
        flexDirection: "column",
        width: Constants.TOURNAMENT_MATCH_WIDTH,
        padding: "0px",
        "&::after": {
            content: props.connectorAfter === ConnectorAfter.NONE ? 'none' : "''",
            width: "50px",
            height: "50%",
            borderTop: props.connectorAfter === ConnectorAfter.DOWN ? "1px solid black" : "none",
            borderBottom: props.connectorAfter === ConnectorAfter.UP ? "1px solid black" : "none",
            borderRight: "1px solid black",
            left: "100%",
            top: props.connectorAfter === ConnectorAfter.UP ? "0%" : "50%",
            marginLeft: "1px",
            marginTop: props.connectorAfter === ConnectorAfter.DOWN ? "-1px" : "0px",
            position: "absolute"
        },
        "&::before": {
            content: props.connectorBefore ? '""' : "none",
            width: "50px",
            borderTop: "1px solid black",
            top: "50%",
            right: "100%",
            marginBottom: "1px",
            marginRight: "1px",
            position: "absolute",
        }
    }),
    cancelledMatch: props => ({
        border: "1px solid black",
        width: Constants.TOURNAMENT_MATCH_WIDTH,
        padding: "0px",
        "&::after": {
            content: props.connectorAfter === ConnectorAfter.NONE ? 'none' : "''",
            width: "50px",
            height: "50%",
            borderTop: props.connectorAfter === ConnectorAfter.DOWN ? "1px solid black" : "none",
            borderBottom: props.connectorAfter === ConnectorAfter.UP ? "1px solid black" : "none",
            borderRight: "1px solid black",
            left: "100%",
            top: props.connectorAfter === ConnectorAfter.UP ? "0%" : "50%",
            marginLeft: "1px",
            marginTop: props.connectorAfter === ConnectorAfter.DOWN ? "-1px" : "0px",
            position: "absolute"
        },
    }),
    team: {
        height: "24px",
        paddingLeft: "2px"
    },
    imageContainer: {
        minWidth: 0
    },
    image: {
        marginRight: "4px",
        padding: "4px",
        height: "20px",
        width: "20px"
    }
}))

export enum ConnectorAfter {
    UP,
    DOWN,
    NONE
}

interface TournamentBracketMatchProps {
    match: Match,
    connectorAfter: ConnectorAfter
    connectorBefore: boolean
}

export const TournamentBracketMatch = (props: TournamentBracketMatchProps): JSX.Element => {
    const classes = useStyles(props)
    const {currentUser} = useGetCurrentUser()
    const navigate = useNavigate()
    const theme = useTheme()

    const isCurrentPlayerOnTeam = useCallback((tournamentRegistration: TournamentRegistration | undefined): boolean => {
        if (!currentUser?.id || !tournamentRegistration) {
            return false
        }
        return tournamentRegistration.players?.map(player => player.id).includes(currentUser.id)
    }, [currentUser])

    if (!props.connectorBefore && !props.match?.tournamentRegistration1 && !props.match?.tournamentRegistration2) {
        return <List component={"nav"} className={classes.cancelledMatch}>
            <ListItem style={{padding: "none", backgroundColor: "#bfbfbf", height: "24px"}}/>
            <Divider/>
            <ListItem style={{padding: "none", backgroundColor: "#bfbfbf", height: "24px"}}/>
        </List>
    }

    const team1 = props.match.tournamentRegistration1?.team
    const team2 = props.match.tournamentRegistration2?.team


    const getTeamColor = (team?: Team): Property.BackgroundColor | undefined => {
        const currentPhase = props.match.currentPhase
        const matchIsFinished = currentPhase.phaseType === MatchPhaseType.Finished

        if (!matchIsFinished || !team) {
            return "white"
        }

        const teamIsTeamOne = team === team1
        const teamIsTeamTwo = team === team2
        const winTeamOne = (currentPhase.state as MatchFinishedPhaseState).winTeamOne

        const winColor = hextToRgb(theme.palette.success.main, 0.25)
        const loseColor = hextToRgb(theme.palette.error.main, 0.25)


        if (teamIsTeamOne) {
            return winTeamOne ? winColor : loseColor
        }

        if (teamIsTeamTwo) {
            return winTeamOne ? loseColor : winColor
        }

        return "white"
    }

    const hextToRgb = (hex: string, opacity: number) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `rgba(
                ${parseInt(result[1], 16)}, 
                ${parseInt(result[2], 16)}, 
                ${parseInt(result[3], 16)}, 
                ${opacity})`
            : undefined;
    }

    return <Button className={classes.match} onClick={() => navigate(`/matches/${props.match.id}` ?? "")}>
        <ListItem className={classes.team} style={{backgroundColor: getTeamColor(team1)}}>
            {team1 ?
                <TournamentBracketMatchTeam team={team1}
                                            isCurrentUserOnTeam={isCurrentPlayerOnTeam(props.match.tournamentRegistration1)}/> :
                <Typography noWrap fontWeight={"bold"} style={{textOverflow: "ellipsis", fontSize: "12px"}}>
                    <i>TBD</i>
                </Typography>
            }
        </ListItem>
        <Divider flexItem/>
        <ListItem className={classes.team} style={{backgroundColor: getTeamColor(team2)}}>
            {team2 ?
                <TournamentBracketMatchTeam team={team2}
                                            isCurrentUserOnTeam={isCurrentPlayerOnTeam(props.match.tournamentRegistration2)}/> :
                <Typography noWrap fontWeight={"bold"} style={{textOverflow: "ellipsis", fontSize: "12px"}}>
                    <i>TBD</i>
                </Typography>
            }
        </ListItem>
    </Button>
}