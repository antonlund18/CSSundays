import * as React from "react"
import {ObjectType, Team} from "../../codegen/generated-types";
import {Grid, Typography} from "@mui/material";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {makeStyles} from "@mui/styles";
import {PlayerPicture} from "../teamspage/team/PlayerPicture";

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

export enum MagePageTeamPosition {
    LEFT,
    RIGHT
}

type MatchPageTeamProps = {
    position: MagePageTeamPosition
    team: Team | undefined
}

export const MatchPageTeam = (props: MatchPageTeamProps) => {
    const classes = useStyles()

    return <Grid item xs={5}>
        <div style={{
            width: "100%",
            height: "100px",
            display: "flex",
            alignItems: "center",
            flexDirection: props.position === MagePageTeamPosition.LEFT ? "row" : "row-reverse"
        }}>
            {props.team ?
                <>
                    <img src={getPictureLinkFromKey(props.team?.picture ?? "", ObjectType.Team)}
                         className={classes.teamPicture}/>
                    <Typography variant={"h2"}
                                color={props.position !== MagePageTeamPosition.LEFT ? "error" : "primary"}
                                sx={{textTransform: "none"}}>{props.team?.name}</Typography>
                </> :
                <>
                    <img src={getPictureLinkFromKey("unknown.png", ObjectType.Team)} className={classes.teamPicture}/>
                    <Typography variant={"h2"}
                                color={props.position !== MagePageTeamPosition.LEFT ? "error" : "primary"}
                                sx={{textTransform: "none"}}>TBD</Typography>
                </>}
        </div>
        <div style={{
            width: "100%",
            display: "flex",
            justifyContent: props.position === MagePageTeamPosition.LEFT ? "end" : "start",
            marginTop: "32px"
        }}>
            {new Array(5).fill(props.team?.users[0]).map(player => {
                return <PlayerPicture player={player}/>
            })}
        </div>
    </Grid>
}