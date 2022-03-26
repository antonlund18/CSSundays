import * as React from "react";
import {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    TextField,
    Typography
} from "@material-ui/core";
import {useTeamsCollection} from "../../firebase/database/database";
import {CreateTeamResponse} from "../../firebase/database/TeamsHandler";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    nameTextfield: {
        minWidth: "min(400px, 90vh)",
    },
    nameInput: {
        transition: "border-color 2s ease-in-out",
    },
    red: {
        "&:focus": {
            borderColor: theme.palette.secondary.main,

        },
    },
    green: {
        "&:focus": {
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
    const teamsDatabase = useTeamsCollection();
    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const createTeam = async () => {
        setError("");

        if (name.length < 2) {
            const errorString = "Dit holdnavn skal mindst være 2 bogstaver langt";
            setError(errorString);
            return;
        }

        const createTeamResponse = await teamsDatabase.createTeam(name);
        if (createTeamResponse === CreateTeamResponse.ERROR_NAME_EXISTS) {
            const errorString = "Der findes allerede et holde med dette navn";
            setError(errorString);
        }

        if (error.length === 0) {
            navigate("/teams/" + name);
        }
    }

    return <Dialog open={props.open}
                   onClose={() => props.setOpen(false)}
    >
        <DialogTitle>
            <DialogContent>
                <Typography variant={"h4"} color={"primary"}>Angiv navn</Typography>

            </DialogContent>
        </DialogTitle>
        <DialogContent>
            <TextField variant={"standard"}
                       value={name}
                       placeholder={"Holdnavn"}
                       className={classes.nameTextfield}
                       InputProps={{disableUnderline: true}}
                       inputProps={{className: classes.nameInput + " " + (name.length < 2 ? classes.red : classes.green)}}
                       onChange={(e) => setName(e.target.value)}
            />
            {error.length > 0 &&
            <Typography className={classes.error} color={"secondary"} gutterBottom={false}>{"* " + error}</Typography>}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.setOpen(false)}>Luk</Button>
            <Button color={"primary"} onClick={() => createTeam()}>Opret</Button>
        </DialogActions>
    </Dialog>
}