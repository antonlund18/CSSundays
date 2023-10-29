import * as React from "react"
import {makeStyles, Typography} from "@material-ui/core";
import {Team, User} from "../../../codegen/generated-types";
import {PlayerPicture} from "./PlayerPicture";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    playersContainer: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#a9a9a9",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        textAlign: "center"
    },
    seeAllPlayers: {
        padding: theme.spacing(1),
        background: "rgba(0, 0, 0, .4)",
        color: "rgb(241,241,241)",
        cursor: "pointer",
    }
}))

export type TeamPlayersContainerProps = {
    team: Team
}

export const TeamPlayersContainer = (props: TeamPlayersContainerProps): JSX.Element => {
    const navigate = useNavigate();
    const classes = useStyles();

    const {team} = props

    return <div className={classes.playersContainer}>
        <div style={{display: "flex"}}>
            {team?.users?.slice(0, 5).map(user => {
                return <PlayerPicture player={user}/>
            })}
        </div>
        <Typography variant={"h4"} className={classes.seeAllPlayers} onClick={() => navigate("players")}>se alle spillere</Typography>
    </div>
}