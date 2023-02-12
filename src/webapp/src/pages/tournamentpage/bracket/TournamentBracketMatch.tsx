import {Match, ObjectType} from "../../../codegen/generated-types";
import {Divider, List, ListItem, ListItemIcon, makeStyles, Theme, Typography} from "@material-ui/core";
import {Constants} from "../../../util/Constants";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import * as React from "react";

interface StylesProps {
    connectorAfter: ConnectorAfter
    connectorBefore: boolean
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    match: props => ({
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
    image: {
        height: "20px",
        width: "20px",
        minWidth: "0px",
        paddingRight: "4px"
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

    if (!props.connectorBefore && !props.match.team1 && !props.match.team2) {
        return <List component={"nav"} className={classes.cancelledMatch}>
            <ListItem style={{padding: "none", backgroundColor: "#bfbfbf", height: "24px"}}/>
            <Divider/>
            <ListItem style={{padding: "none", backgroundColor: "#bfbfbf", height: "24px"}}/>
        </List>
    }

    const {team1, team2} = props.match

    return <List component={"nav"} className={classes.match}>
        <ListItem button className={classes.team}>
            {team1 && <ListItemIcon>
                <img className={classes.image}
                     src={getPictureLinkFromKey(team1.picture ?? null, ObjectType.Team)}/>
            </ListItemIcon>}
            <Typography noWrap style={{textOverflow: "ellipsis", fontSize: "12px"}}>
                {team1 ? team1.name : <i>TBD</i>}
            </Typography>
        </ListItem>
        <Divider/>
        <ListItem button className={classes.team}>
            {team2 && <ListItemIcon>
                <img className={classes.image}
                     src={getPictureLinkFromKey(team2.picture ?? null, ObjectType.Team)}/>
            </ListItemIcon>}
            <Typography noWrap style={{textOverflow: "ellipsis", fontSize: "12px"}}>
                {team2 ? team2.name : <i>TBD</i>}
            </Typography>
        </ListItem>
    </List>
}