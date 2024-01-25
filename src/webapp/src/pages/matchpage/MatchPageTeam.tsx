import * as React from "react"
import {ObjectType, Team, User} from "../../codegen/generated-types";
import {Grid, Typography} from "@mui/material";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {makeStyles} from "@mui/styles";
import {PlayerPicture} from "../teamspage/team/PlayerPicture";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles({
    vsContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    teamPicture: {
        border: "2px solid white",
        height: "100%",
        aspectRatio: "1/1",
        objectFit: "cover",
        marginRight: "16px",
        marginLeft: "16px"
    },
})

export enum MatchPageTeamPosition {
    LEFT,
    RIGHT
}

type MatchPageTeamProps = {
    position: MatchPageTeamPosition
    team: Team | undefined
    players: User[]
}

export const MatchPageTeam = (props: MatchPageTeamProps) => {
    const classes = useStyles()
    const navigate = useNavigate()

    return <Grid item xs={5}>
        <div style={{
            width: "100%",
            height: "100px",
            display: "flex",
            alignItems: "center",
            flexDirection: props.position === MatchPageTeamPosition.LEFT ? "row" : "row-reverse",
            cursor: props.team ? "pointer" : "default",
        }}
             onClick={() => {
                 if (props.team) {
                     navigate(`/teams/${props.team?.id}`)
                 }
             }}
        >
            {props.team ?
                <>
                    <img src={getPictureLinkFromKey(props.team?.picture ?? "", ObjectType.Team)}
                         className={classes.teamPicture}/>
                    <Typography variant={"h2"}
                                color={props.position !== MatchPageTeamPosition.LEFT ? "error" : "primary"}
                                sx={{textTransform: "none"}}>{props.team?.name}</Typography>
                </> :
                <>
                    <img src={getPictureLinkFromKey("unknown.png", ObjectType.Team)} className={classes.teamPicture}/>
                    <Typography variant={"h2"}
                                color={props.position !== MatchPageTeamPosition.LEFT ? "error" : "primary"}
                                sx={{textTransform: "none"}}>TBD</Typography>
                </>}
        </div>
        <div style={{
            width: "100%",
            display: "flex",
            justifyContent: props.position === MatchPageTeamPosition.RIGHT ? "end" : "start",
            marginTop: "32px"
        }}>
            {props.players?.slice(0, 5).map(player => {
                return <PlayerPicture player={player}/>
            })}
        </div>
    </Grid>
}