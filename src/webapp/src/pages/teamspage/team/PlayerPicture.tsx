import * as React from "react"
import {CSSProperties} from "react"
import {ObjectType, User} from "../../../codegen/generated-types";
import {Box, Theme} from "@mui/material";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {useNavigate} from "react-router-dom";
import {makeStyles} from "@mui/styles"
import {Check, Close} from "@mui/icons-material";

type StylesProps = {
    playerPictureURL: string
    playerName: string
    style?: CSSProperties
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    playerContainer: props => ({
        position: "relative",
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
    showSteamVerification?: boolean
    style?: CSSProperties
}

export const PlayerPicture = (props: PlayerPictureProps): JSX.Element => {
    const {player} = props
    const navigate = useNavigate();
    const playerPictureURL = getPictureLinkFromKey(player?.picture ?? null, ObjectType.User)
    const playerName = player?.playertag ? player.playertag : ""
    const classes = useStyles({playerPictureURL: playerPictureURL, playerName: playerName, style: props.style});

    if (!player) {
        return <></>
    }

    const isSteamVerificed = !!player.steamId

    return <div key={player.playertag} className={classes.playerContainer}
                onClick={() => navigate("/players/" + player.id)}>
        <Box boxShadow={1} className={classes.playerPicture}/>
        {props.showSteamVerification &&
            <div>
                <img
                    src={"https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png"}
                    style={{
                        position: "absolute",
                        width: "24px",
                        aspectRatio: "1/1",
                        top: 0,
                        right: 0,
                    }}/>
                {isSteamVerificed ?
                    <Check
                        style={{
                            fontSize: "12px",
                            backgroundColor: "green",
                            position: "absolute",
                            top: 0,
                            right: 12,
                            color: "white",
                            stroke: "white",
                            strokeWidth: "1px",
                            borderRadius: "50%",
                        }}/> :
                    <Close
                        style={{
                            fontSize: "12px",
                            backgroundColor: "red",
                            position: "absolute",
                            top: 0,
                            right: 12,
                            color: "white",
                            stroke: "white",
                            strokeWidth: "1px",
                            borderRadius: "50%",
                        }}/>
                }
            </div>
        }
    </div>
}