import * as React from "react";
import {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useMutateTeam} from "../../hooks/api/useTeam";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {makeStyles} from "@mui/styles"
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {ObjectType} from "../../codegen/generated-types";
import {useSharedTeamAndUser} from "../../hooks/api/useSharedTeamAndUser";


const useStyles = makeStyles(theme => ({
    nameTextfield: {
        marginTop: "16px",
        width: "100%",
    },
    nameInput: {
        transition: "border-color 2s ease-in-out",
    },
    red: {
        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.secondary.main,

        },
    },
    green: {
        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#34da56",
        }
    },
    error: {
        paddingTop: theme.spacing(2),
    },
    playerPicture: {
        width: "100%",
        aspectRatio: "1/1",
        border: "2px solid white",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        backgroundColor: "#525252",
        objectFit: "cover",
    },
    fields: {
        width: "100%",
    }
}))

interface CreateTeamDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void,
}

export const CreateTeamDialog = (props: CreateTeamDialogProps): JSX.Element => {
    const navigate = useNavigate();

    const {currentUser} = useGetCurrentUser();
    const {createTeam} = useMutateTeam();
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [fileSelector, setFileSelector] = useState<HTMLInputElement | null>(null);
    const [teamPicture, setTeamPicture] = useState("")
    const classes = useStyles({teamPicture: teamPicture});
    const {setAndUploadPicture} = useSharedTeamAndUser();


    useEffect(() => {
        if (fileSelector === null) {
            const selector = document.createElement("input");
            selector.setAttribute("type", "file");
            selector.setAttribute("accept", "image/jpeg, image/png, image/jpg");
            selector.addEventListener("change", async () => {
                const file = selector?.files?.item(0)
                if (file) {
                    const reader: FileReader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onloadend = () => {
                        setTeamPicture(reader?.result + "" ?? "")
                    }
                }
            })
            setFileSelector(selector);
        }
    }, [fileSelector])

    const handleCreate = async () => {
        setError("");

        if (name.length < 2) {
            const errorString = "Dit holdnavn skal mindst være 2 tegn";
            setError(errorString);
            return;
        }

        const {data} = await createTeam(name, currentUser?.id ?? -1)
        await setAndUploadPicture(data?.createTeam?.id ?? -1, fileSelector, ObjectType.Team, false)
        navigate("/teams/" + data?.createTeam?.id);
        handleClose()
    }

    const handleFileSelect = () => {
        fileSelector?.click();
    }

    const handleClose = () => {
        props.setOpen(false)
        setFileSelector(null)
        setName("")
        setTeamPicture("")
    }

    return <Dialog open={props.open} onClose={handleClose} keepMounted={false}>
        <DialogContent style={{width: "400px"}}>
            <Typography variant={"h4"} color={"primary"} gutterBottom>Opret hold</Typography>

            <img className={classes.playerPicture} src={teamPicture === "" ? getPictureLinkFromKey(teamPicture, ObjectType.Team) : teamPicture}/>
            <div style={{display: "flex", justifyContent: "center"}}>
                <Button onClick={handleFileSelect}>Skift billede</Button>
            </div>
            <TextField variant={"outlined"}
                       label={"Holdnavn"}
                       value={name}
                       className={classes.nameTextfield}
                       InputLabelProps={{shrink: true}}
                       InputProps={{className: classes.nameInput + " " + (name.length < 2 ? classes.red : classes.green)}}
                       onChange={(e) => setName(e.target.value)}
            />
            {error.length > 0 &&
                <Typography className={classes.error} color={"secondary"}
                            gutterBottom={false}>{"* " + error}</Typography>}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Luk</Button>
            <Button color={"primary"} onClick={handleCreate} variant={"contained"}>Opret</Button>
        </DialogActions>
    </Dialog>
}