import * as React from "react"
import {ObjectType, User} from "../../../codegen/generated-types";
import {Box, Theme} from "@mui/material";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {useNavigate} from "react-router-dom";
import {makeStyles} from "@mui/styles"

type StylesProps = {
    playerPictureURL: string
    playerName: string
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    playerContainer: {
        cursor: "pointer",
        textAlign: "center",
        justifyContent: "center",
    },
    playerPicture: props => ({
        height: "132px",
        width: "132px",
        margin: theme.spacing(1),
        border: "2px solid white",
        position: "relative",
        backgroundImage: "url(" + props.playerPictureURL + " )",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
    }),
    image: props => ({
        "&::after": {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "rgba(0, 0, 0, .4)",
            color: "rgb(241,241,241)",
            content: "'" + props.playerName + "'"
        },
    }),
}))

export type PlayerPictureProps = {
    player: User
}

export const PlayerPicture = (props: PlayerPictureProps): JSX. Element => {
    const {player} = props
    const playerPictureURL = getPictureLinkFromKey(player.picture ?? null, ObjectType.User)
    const playerName = player.playertag ? player.playertag : ""
    const classes = useStyles({playerPictureURL: playerPictureURL, playerName: playerName});
    const navigate = useNavigate();

    return <div key={player.playertag} className={classes.playerContainer}
                onClick={() => navigate("/players/" + player.id)}>
        <Box boxShadow={1} className={classes.playerPicture}>
            <div className={classes.image}/>
        </Box>
    </div>
}