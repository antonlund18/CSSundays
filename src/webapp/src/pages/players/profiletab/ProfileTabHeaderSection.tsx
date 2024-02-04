import * as React from "react"
import {useContext, useEffect, useState} from "react"
import {ObjectType, User} from "../../../codegen/generated-types";
import {Grid, IconButton, Tooltip, Typography} from "@mui/material";
import {Check, Close, GroupAddRounded, Groups, Mail, Report, Warning} from "@mui/icons-material";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {makeStyles, useTheme} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {useSharedTeamAndUser} from "../../../hooks/api/useSharedTeamAndUser";
import {SnackbarContext} from "../../../SnackbarContextProvider";
import {formatDate} from "../../../helpers/helpers";
import { useDateFormatter } from "../../../hooks/useDateFormatter";

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
        padding: "64px 0px 32px 16px !important",
    }
}));

type ProfileHeaderSectionProps = {
    player: User
    isCurrentUser: boolean
    setDialogOpen: (open: boolean) => void
}

export const ProfileTabHeaderSection = (props: ProfileHeaderSectionProps): JSX.Element => {
    const {openSnackbar} = useContext(SnackbarContext)
    const playerPictureUrl = getPictureLinkFromKey(props.player.picture ?? "", ObjectType.User)
    const classes = useStyles({isCurrentUser: props.isCurrentUser, playerPictureUrl: playerPictureUrl})
    const [fileSelector, setFileSelector] = useState<HTMLInputElement | null>(null);
    const {setAndUploadPicture} = useSharedTeamAndUser();
    const theme = useTheme()
    const {formatDate} = useDateFormatter()

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

    const isSteamVerified = props.player.steamId

    return <>
        <Grid item container xs={10}>
            <Grid item xs={3}>
                <Tooltip title={"Upload billede"} disableHoverListener={!props.isCurrentUser} arrow>
                    <div className={classes.playerPicture} onClick={handleFileSelect}/>
                </Tooltip>
            </Grid>
            <Grid item xs={9} className={classes.description}>
                <div>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        {isSteamVerified ?
                            <Check style={{
                                color: theme.palette.success.main,
                                fontSize: "13px"
                            }}/> : <Close style={{
                                color: theme.palette.error.main,
                                fontSize: "13px"
                            }}/>}
                        <Typography variant={"body1"}
                                    style={{marginLeft: "4px", lineHeight: "1"}}
                                    color={isSteamVerified ? theme.palette.success.main : theme.palette.error.main}>
                            {isSteamVerified ? "STEAM VERIFICERET" : "IKKE STEAM VERIFICERET"}
                        </Typography>
                    </div>
                    <Typography variant={"h2"} style={{textTransform: "none"}}>{props.player.playertag}</Typography>
                </div>
                <Typography variant={"body2"} style={{marginTop: "16px"}}>{props.player.description}</Typography>
            </Grid>
            {props.player.deletedTs &&
                <Grid item xs={12} style={{display: "flex", alignItems: "center", marginTop: "16px"}}>
                    <Warning color={"error"} style={{display: "inline-flex"}}/>
                    <Typography color={"error"} style={{display: "inline-flex", marginLeft: "8px"}}>{`Denne bruger blev slettet d. ${formatDate(props.player.deletedTs)}`}</Typography>
                </Grid>}
        </Grid>
        <Grid item xs={2} sx={{display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center"}}>
            {!props.isCurrentUser &&
                <>
                    <Tooltip title={"Tilføj ven"} placement={"left"} arrow
                             onClick={() => openSnackbar("'Venner' kommer snart!", "info")}>
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
                                    onClick={() => openSnackbar("'Beskeder' kommer snart!", "info")}>
                            <Mail/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Rapportér bruger"} placement={"left"} arrow>
                        <IconButton sx={{aspectRatio: "1/1", width: "40px"}}
                                    onClick={() => openSnackbar("'Rapportér' kommer snart!", "info")}>
                            <Report/>
                        </IconButton>
                    </Tooltip>
                </>
            }
        </Grid>
    </>
}