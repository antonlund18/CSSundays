import {Match, Team} from "../../../codegen/generated-types";
import {Button, Divider, List, ListItem, Theme, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {Constants} from "../../../util/Constants";
import * as React from "react";
import {useCallback} from "react";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {TournamentBracketMatchTeam} from "./TournamentBracketMatchTeam";
import {useNavigate} from "react-router-dom";

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

    const currentPlayerIsOnTeam = useCallback((team: Team): boolean => {
        if (!currentUser?.id) {
            return false
        }
        return team.users.map(user => user.id).includes(currentUser.id)
    }, [currentUser])

    if (!props.connectorBefore && !props.match.team1 && !props.match.team2) {
        return <List component={"nav"} className={classes.cancelledMatch}>
            <ListItem style={{padding: "none", backgroundColor: "#bfbfbf", height: "24px"}}/>
            <Divider/>
            <ListItem style={{padding: "none", backgroundColor: "#bfbfbf", height: "24px"}}/>
        </List>
    }

    const {team1, team2} = props.match

    return <Button className={classes.match} onClick={() => navigate(`/matches/${props.match.id}` ?? "")}>
        <ListItem className={classes.team}>
            {team1 ?
                <TournamentBracketMatchTeam team={team1} isCurrentUserOnTeam={currentPlayerIsOnTeam(team1)}/> :
                <Typography noWrap fontWeight={"bold"} style={{textOverflow: "ellipsis", fontSize: "12px"}}>
                    <i>TBD</i>
                </Typography>
            }
        </ListItem>
        <Divider flexItem/>
        <ListItem className={classes.team}>
            {team2 ?
                <TournamentBracketMatchTeam team={team2} isCurrentUserOnTeam={currentPlayerIsOnTeam(team2)}/> :
                <Typography noWrap fontWeight={"bold"} style={{textOverflow: "ellipsis", fontSize: "12px"}}>
                    <i>TBD</i>
                </Typography>
            }
        </ListItem>
    </Button>
}