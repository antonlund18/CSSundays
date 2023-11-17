import * as React from "react"
import {ObjectType, User} from "../../codegen/generated-types";
import {Grid, IconButton, Snackbar, Tooltip, Typography} from "@mui/material";
import {GroupAddRounded, Groups, Mail, Report} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {useSharedTeamAndUser} from "../../hooks/api/useSharedTeamAndUser";
import {Alert} from "../../components/Alert";

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
    }),
    description: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "space-between",
        padding: "64px 0px 64px 16px !important",
    }
}));

type ProfileHeaderSectionProps = {
    player: User
    isCurrentUser: boolean
    setDialogOpen: (open: boolean) => void
}

export const ProfileTabHeaderSection = (props: ProfileHeaderSectionProps): JSX.Element => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
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

    const openSnackbar = (text: string) => {
        setSnackbarText(text)
        setSnackbarOpen(true)
    }

    const closeSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return
        }

        setSnackbarOpen(false)
    }

    return <>
        <Grid item container xs={10}>
            <Grid item xs={3}>
                <Tooltip title={"Upload billede"} disableHoverListener={!props.isCurrentUser} arrow>
                    <div className={classes.playerPicture} onClick={handleFileSelect}/>
                </Tooltip>
            </Grid>
            <Grid item xs={9} className={classes.description}>
                <Typography variant={"h2"} style={{textTransform: "none"}}>{props.player.playertag}</Typography>
                <Typography>straight up killa</Typography>
            </Grid>
        </Grid>
        <Grid item xs={2} sx={{display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center"}}>
            {!props.isCurrentUser &&
                <>
                    <Tooltip title={"Tilføj ven"} placement={"left"} arrow
                             onClick={() => openSnackbar("'Venner' kommer snart!")}>
                        <IconButton sx={{aspectRatio: "1/1", width: "40px"}}>
                            <GroupAddRounded/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Inviter til hold"} placement={"left"} arrow>
                        <IconButton sx={{aspectRatio: "1/1", width: "40px"}} onClick={() => props.setDialogOpen(true)}>
                            <Groups/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Send besked"} placement={"left"} arrow>
                        <IconButton sx={{aspectRatio: "1/1", width: "40px"}}
                                    onClick={() => openSnackbar("'Beskeder' kommer snart!")}>
                            <Mail/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Rapportér bruger"} placement={"left"} arrow>
                        <IconButton sx={{aspectRatio: "1/1", width: "40px"}}
                                    onClick={() => openSnackbar("'Rapportér' kommer snart!")}>
                            <Report/>
                        </IconButton>
                    </Tooltip>
                </>
            }
        </Grid>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar}>
            <Alert severity={"warning"}>{snackbarText}</Alert>
        </Snackbar>
    </>
}