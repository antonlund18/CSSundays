import * as React from "react"
import {ObjectType, User} from "../../../codegen/generated-types";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {useNavigate} from "react-router-dom";

type StylesProps = {
    playerPictureUrl: string
    playerName: string
}

const BORDER_SIZE = "2px"
const IMAGE_SIZE = "32px"

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    playerPicture: props => ({
        "&::after": {
            fontSize: "8px",
            textAlign: "center",
            textOverflow: "ellipsis",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "calc(" + IMAGE_SIZE + " - " + BORDER_SIZE + " * 2)",
            overflow: "hidden",
            background: "rgba(0, 0, 0, .4)",
            color: "rgb(241,241,241)",
            content: "'" + props.playerName + "'",
        },
        height: IMAGE_SIZE,
        width: IMAGE_SIZE,
        margin: theme.spacing(1),
        border: BORDER_SIZE + " solid white",
        position: "relative",
        backgroundImage: "url(" + props.playerPictureUrl + " )",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        cursor: "pointer",
    }),
}))

type PlayerBoxProps = {
    player: User
}

export const PlayerBox = (props: PlayerBoxProps): JSX.Element => {
    const playerPictureUrl = getPictureLinkFromKey(props.player.picture ?? "", ObjectType.User)
    const classes = useStyles({playerPictureUrl: playerPictureUrl, playerName: props.player.playertag})
    const navigate = useNavigate()

    return <div className={classes.playerPicture} onClick={() => navigate("/players/" + props.player.id)}/>
}