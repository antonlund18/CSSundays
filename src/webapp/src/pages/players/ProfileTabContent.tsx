import * as React from "react"
import {useEffect, useState} from "react"
import {ObjectType, User} from "../../codegen/generated-types";
import {Box, Grid, Tooltip} from "@mui/material";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {Theme} from "@mui/material/styles";
import {makeStyles} from "@mui/styles";
import {useSharedTeamAndUser} from "../../hooks/api/useSharedTeamAndUser";

interface StylesProps {
    isCurrentUser: boolean
    playerPictureUrl: string
}


const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    playerPicture: props => ({
        width: "100%",
        aspectRatio: "1/1",
        border: "2px solid white",
        cursor: props.isCurrentUser ? "pointer" : "default",
        backgroundImage: "url(" + props.playerPictureUrl + " )",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        backgroundColor: "#525252"
    })
}));

type ProfileTabContentProps = {
    player: User
    isCurrentUser: boolean
}

export const ProfileTabContent = (props: ProfileTabContentProps): JSX.Element => {
    const playerPictureUrl = getPictureLinkFromKey(props.player.picture ?? "", ObjectType.User)
    const classes = useStyles({isCurrentUser: props.isCurrentUser, playerPictureUrl: playerPictureUrl})
    const [fileSelector, setFileSelector] = useState<HTMLInputElement | null>(null);
    const {setAndUploadPicture} = useSharedTeamAndUser();

    useEffect(() => {
        if (props.player) {
            const selector = document.createElement("input");
            selector.setAttribute("type", "file");
            selector.setAttribute("accept", "image/jpeg, image/png, image/jpg");
            selector.addEventListener("change", async () => {
                if (props.player.id) {
                    await setAndUploadPicture(props.player.id, selector, ObjectType.User)
                }
            })
            setFileSelector(selector);
        }
    }, [props.player])

    const handleFileSelect = () => {
        if (props.isCurrentUser) {
            fileSelector?.click();
        }
    }

    return <Grid container spacing={4}>
        <Grid item xs={3}>
            <Tooltip title={"Upload billede"} disableHoverListener={!props.isCurrentUser} arrow>
                <div className={classes.playerPicture} onClick={handleFileSelect}/>
            </Tooltip>
        </Grid>
        <Grid item xs={9}>
            aber
        </Grid>
    </Grid>
}