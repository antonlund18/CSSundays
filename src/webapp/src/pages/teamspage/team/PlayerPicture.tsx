import * as React from "react"
import {ObjectType, User} from "../../../codegen/generated-types";
import {Box, Theme} from "@mui/material";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {useNavigate} from "react-router-dom";
import {makeStyles} from "@mui/styles"
import {CSSProperties} from "react";

type StylesProps = {
    playerPictureURL: string
    playerName: string
    style?: CSSProperties
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    playerContainer: props => ({
        cursor: "pointer",
        textAlign: "center",
        justifyContent: "center",
        width: "20%",
        padding: "8px",
        ...props.style
    }),
    playerPicture: props => ({
        "&::after": {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "rgba(0, 0, 0, .4)",
            color: "rgb(241,241,241)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            content: "'" + props.playerName + "'"
        },
        "&:hover:after": {
            color: theme.palette.primary.main,
        },
        width: "100%",
        aspectRatio: "1/1",
        border: "2px solid white",
        position: "relative",
        backgroundImage: "url(" + props.playerPictureURL + " )",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
    }),
}))

export type PlayerPictureProps = {
    player: User | null
    style?: CSSProperties
}

export const PlayerPicture = (props: PlayerPictureProps): JSX. Element => {
    const {player} = props
    const navigate = useNavigate();
    const playerPictureURL = getPictureLinkFromKey(player?.picture ?? null, ObjectType.User)
    const playerName = player?.playertag ? player.playertag : ""
    const classes = useStyles({playerPictureURL: playerPictureURL, playerName: playerName, style: props.style});

    if (!player) {
        return <></>
    }

    return <div key={player.playertag} className={classes.playerContainer}
                onClick={() => navigate("/players/" + player.id)}>
        <Box boxShadow={1} className={classes.playerPicture}/>
    </div>
}