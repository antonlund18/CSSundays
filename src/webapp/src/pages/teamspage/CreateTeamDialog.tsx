import * as React from "react";
import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useMutateTeam} from "../../hooks/api/useTeam";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles(theme => ({
    nameTextfield: {
        marginTop: "16px",
        minWidth: "min(400px, 90vh)",
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
    }
}))

interface CreateTeamDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void,
}

export const CreateTeamDialog = (props: CreateTeamDialogProps): JSX.Element => {
    const classes = useStyles();
    const navigate = useNavigate();

    const {currentUser} = useGetCurrentUser();
    const {createTeam} = useMutateTeam();
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleCreate = async () => {
        setError("");

        if (name.length < 2) {
            const errorString = "Dit holdnavn skal mindst være 2 tegn";
            setError(errorString);
            return;
        }

        createTeam(name, currentUser?.id ?? -1).then(data => {
            navigate("/teams/" + data.data?.createTeam?.id);
        })
    }

    return <Dialog open={props.open}
                   onClose={() => props.setOpen(false)}
    >
        <DialogContent>
            <Typography variant={"h4"} color={"primary"} gutterBottom>Opret hold</Typography>
            <TextField variant={"outlined"}
                       label={"Holdnavn"}
                       value={name}
                       className={classes.nameTextfield}
                       InputLabelProps={{shrink: true}}
                       InputProps={{className: classes.nameInput + " " + (name.length < 2 ? classes.red : classes.green)}}
                       onChange={(e) => setName(e.target.value)}
            />
            {error.length > 0 &&
            <Typography className={classes.error} color={"secondary"} gutterBottom={false}>{"* " + error}</Typography>}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.setOpen(false)}>Luk</Button>
            <Button color={"primary"} onClick={handleCreate}>Opret</Button>
        </DialogActions>
    </Dialog>
}