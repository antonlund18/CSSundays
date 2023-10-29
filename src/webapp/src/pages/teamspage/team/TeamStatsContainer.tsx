import * as React from "react"
import {Box, Button, Divider as MuiDivider, Grid, makeStyles, Typography} from "@material-ui/core";
import {ObjectType, Team, User} from "../../../codegen/generated-types";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {useNavigate} from "react-router-dom";
import {calculateWinrate} from "../../../helpers/helpers";
import {useMutateTeam} from "../../../hooks/api/useTeam";

const useStyles = makeStyles(theme => ({
    teamStatsContainer: {
        width: "100%",
        marginTop: theme.spacing(3),
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#a9a9a9",
        borderRadius: "4px",
        padding: theme.spacing(2)
    },
    emptyTeamStatsContainer: {
        width: "100%",
        height: "30vh",
        marginTop: theme.spacing(3),
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#a9a9a9",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    teamStats: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between"
    },
    MuiDivider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
}))

export type TeamStatsContainerProps = {
    team: Team
}

export const TeamStatsContainer = (props: TeamStatsContainerProps): JSX.Element => {
    const classes = useStyles();
    const {incrementWins, incrementLosses} = useMutateTeam();

    const {team} = props

    return <div className={classes.emptyTeamStatsContainer}>
        <Typography variant={"h2"}>Stats er under udvikling 🔨</Typography>
    </div>

    /*
    <div className={classes.teamStatsContainer}>
        <div className={classes.teamStats}>
            <Typography variant={"subtitle1"}>Wins</Typography>
            <Typography variant={"subtitle1"}>{team?.wins}</Typography>
        </div>
        <MuiDivider className={classes.MuiDivider}/>
        <div className={classes.teamStats}>
            <Typography variant={"subtitle1"}>Losses</Typography>
            <Typography variant={"subtitle1"}>{team?.losses}</Typography>
        </div>
        <MuiDivider className={classes.MuiDivider}/>
        <div className={classes.teamStats}>
            <Typography variant={"subtitle1"}>Winrate</Typography>
            <Typography variant={"subtitle1"}>{calculateWinrate(team?.wins, team?.losses)}</Typography>
        </div>
        <MuiDivider className={classes.MuiDivider}/>
        <Button onClick={() => incrementWins(team?.id ?? -1)} color={"primary"} variant={"contained"}>+1
            wins</Button>
        <Button onClick={() => incrementLosses(team?.id ?? -1)} color={"primary"} variant={"contained"}>+1
            losses</Button>
    </div>
    */
}