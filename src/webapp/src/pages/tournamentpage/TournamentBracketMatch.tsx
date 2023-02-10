import {Match} from "../../codegen/generated-types";
import {Divider, List, ListItem, makeStyles, Theme, Typography} from "@material-ui/core";

interface StylesProps {
    connectorAfter: ConnectorAfter
    connectorBefore: boolean
}

const pseudoBefore = {}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    match: props => ({
        border: "1px solid black",
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
    })
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
            <ListItem style={{padding: "none", backgroundColor: "#bfbfbf", minHeight: "36px"}}/>
            <Divider/>
            <ListItem style={{padding: "none", backgroundColor: "#bfbfbf", minHeight: "36px"}}/>
        </List>
    }

    return <List component={"nav"} className={classes.match}>
        <ListItem>
            <Typography noWrap style={{textOverflow: "ellipsis"}}>
                {props.match.team1 ? props.match.team1.name : "TBD"}
            </Typography>
        </ListItem>
        <Divider/>
        <ListItem>
            <Typography noWrap style={{textOverflow: "ellipsis"}}>
                {props.match.team2 ? props.match.team2.name : "TBD"}
            </Typography>
        </ListItem>
    </List>
}