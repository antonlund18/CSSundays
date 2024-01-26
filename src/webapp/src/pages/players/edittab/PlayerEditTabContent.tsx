import * as React from "react"
import {useContext, useEffect, useState} from "react"
import {ObjectType, User, useUpdateUserMutation} from "../../../codegen/generated-types";
import {Button, Grid, TextField, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {useSharedTeamAndUser} from "../../../hooks/api/useSharedTeamAndUser";
import {PlayerEditChangePasswordDialog} from "./PlayerEditChangePasswordDialog";
import {SnackbarContext} from "../../../SnackbarContextProvider";

interface StylesProps {
    isCurrentUser: boolean
    playerPictureUrl: string
}


const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    emptyFriendsContainer: {
        height: "75vh",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#a9a9a9",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    playerPicture: props => ({
        width: "100%",
        aspectRatio: "1/1",
        border: "2px solid white",
        backgroundImage: "url(" + props.playerPictureUrl + " )",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        backgroundColor: "#525252"
    }),
    fields: {
        width: "100%",
    }
}))

type PlayerEditTabContentProps = {
    player: User
    isCurrentUser: boolean
}

export const PlayerEditTabContent = (props: PlayerEditTabContentProps): JSX.Element => {
    const [playerPictureUrl, setPlayerPictureUrl] = useState(getPictureLinkFromKey(props.player.picture ?? "", ObjectType.User))
    const classes = useStyles({isCurrentUser: props.isCurrentUser, playerPictureUrl: playerPictureUrl})
    const [fileSelector, setFileSelector] = useState<HTMLInputElement | null>(null);
    const {setAndUploadPicture} = useSharedTeamAndUser();
    const [description, setDescription] = useState(props.player.description)
    const [email, setEmail] = useState(props.player.email)
    const [updateUser] = useUpdateUserMutation()
    const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
    const {openSnackbar} = useContext(SnackbarContext)

    useEffect(() => {
        const selector = document.createElement("input");
        selector.setAttribute("type", "file");
        selector.setAttribute("accept", "image/jpeg, image/png, image/jpg");
        selector.addEventListener("change", async () => {
            const file = selector?.files?.item(0)
            if (file) {
                const reader: FileReader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = () => {
                    setPlayerPictureUrl(reader?.result + "" ?? "")
                }
            }
        })
        setFileSelector(selector);
    }, [props.player])

    const handleFileSelect = () => {
        fileSelector?.click();
    }

    const handleSave = async () => {
        if (!props.player.id) {
            return
        }

        const updatedPlayer = {
            id: props.player.id,
            description,
            email
        }

        await updateUser({variables: {editUserInput: updatedPlayer}})
        await setAndUploadPicture(props.player.id, fileSelector, ObjectType.User, false)

        openSnackbar("Brugeroplysninger gemt", "success")
    }

    return <Grid item container xs={12} spacing={2}>
        <Grid item xs={3}>
            <div className={classes.playerPicture}/>
            <div style={{display: "flex", justifyContent: "center"}}>
                <Button onClick={handleFileSelect}>Skift billede</Button>
            </div>
        </Grid>
        <Grid item xs={9} className={classes.fields}>
            <Typography variant={"subtitle2"}>Navn</Typography>
            <TextField value={props.player.playertag} fullWidth disabled sx={{backgroundColor: "white", borderRadius: "4px"}}/>
            <Typography variant={"subtitle2"} sx={{marginTop: "16px"}}>Email</Typography>
            <TextField value={email} fullWidth onChange={e => setEmail(e.target.value)}
                       sx={{backgroundColor: "white", borderRadius: "4px"}}/>
            <Typography variant={"subtitle2"} sx={{marginTop: "16px"}}>Beskrivelse</Typography>
            <TextField value={description} onChange={e => setDescription(e.target.value)} multiline rows={2} fullWidth
                       sx={{backgroundColor: "white", borderRadius: "4px"}}/>
        </Grid>
        <Grid item xs={12} sx={{display: "flex", justifyContent: "end"}}>
            <Button variant={"outlined"} sx={{marginRight: "16px"}} onClick={() => setChangePasswordDialogOpen(true)}>Skift kodeord</Button>
            <Button variant={"contained"} onClick={handleSave}>Gem</Button>
        </Grid>
        <PlayerEditChangePasswordDialog open={changePasswordDialogOpen} setOpen={setChangePasswordDialogOpen} player={props.player}/>
    </Grid>
}
