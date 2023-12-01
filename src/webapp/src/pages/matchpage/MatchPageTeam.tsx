import * as React from "react"
import {ObjectType, Team} from "../../codegen/generated-types";
import {Grid, Typography} from "@mui/material";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles({
    teamContainer: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
    },
    vsContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    teamPicture: {
        border: "2px solid white",
        height: "96px",
        width: "96px",
        objectFit: "cover",
        marginLeft: "16px",
        marginRight: "16px",
    },
    playerPicture: {
        borderRadius: "50%",
        border: "2px solid white",
        aspectRatio: "1/1",
        width: "60%",
        objectFit: "cover",
        marginLeft: "16px",
        marginRight: "16px",
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

    if (!props.team) {
        return <></>
    }

    console.log(props.team.users)

    return <Grid item xs={5} className={classes.teamContainer}>
        <div style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: props.position === MagePageTeamPosition.LEFT ? "end" : "start",
            flexDirection: props.position === MagePageTeamPosition.LEFT ? "row" : "row-reverse"
        }}>
            <Typography variant={"h2"} color={props.position !== MagePageTeamPosition.LEFT ? "error" : "primary"}
                        sx={{textTransform: "none"}}>{props.team.name}</Typography>
            <img src={getPictureLinkFromKey(props.team.picture ?? "", ObjectType.Team)}
                 className={classes.teamPicture}/>
        </div>
        <div style={{
            width: "100%",
            display: "flex",
            justifyContent: props.position === MagePageTeamPosition.LEFT ? "end" : "start",
            marginTop: "32px"
        }}>
            {props.team.users.slice(0, 5).map(player => {
                return <div style={{
                    marginRight: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "20%",
                }}>
                    <img src={getPictureLinkFromKey(player.picture ?? "", ObjectType.User)}
                         className={classes.playerPicture}/>
                    <Typography variant={"subtitle2"} sx={{textTransform: "none"}}>{player.playertag}</Typography>
                </div>
            })}
        </div>
    </Grid>
}