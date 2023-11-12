import {Match, ObjectType} from "../../../codegen/generated-types";
import {Divider, List, ListItem, ListItemIcon, Theme, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
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
            {team1 && <ListItemIcon className={classes.imageContainer}>
                <img src={getPictureLinkFromKey(team1.picture ?? null, ObjectType.Team)} className={classes.image}/>
            </ListItemIcon>}
            <Typography noWrap style={{textOverflow: "ellipsis", fontSize: "12px"}}>
                {team1 ? team1.name : <i>TBD</i>}
            </Typography>
        </ListItem>
        <Divider/>
        <ListItem button className={classes.team}>
            {team2 && <ListItemIcon className={classes.imageContainer}>
                <img src={getPictureLinkFromKey(team2.picture ?? null, ObjectType.Team)} className={classes.image}/>
            </ListItemIcon>}
            <Typography noWrap style={{textOverflow: "ellipsis", fontSize: "12px"}}>
                {team2 ? team2.name : <i>TBD</i>}
            </Typography>
        </ListItem>
    </List>
}