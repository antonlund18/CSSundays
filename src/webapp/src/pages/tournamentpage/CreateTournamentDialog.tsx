import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton,
    makeStyles,
    TextField,
    Typography
} from "@material-ui/core";
import * as React from "react";
import {useState} from "react";
import {Refresh} from "@material-ui/icons";
import {useTournaments} from "../../hooks/api/useTournament";

const useStyles = makeStyles(theme => ({
    textField: {},
    textLabel: {
        marginTop: theme.spacing(1),
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
    },
    resetDateButton: {
        height: "52px",
        marginLeft: theme.spacing(1)
    }
}))

export interface CreateTournamentDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export const CreateTournamentDialog = (props: CreateTournamentDialogProps): JSX.Element => {
    const classes = useStyles();
    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<string>("")
    const [size, setSize] = useState<number>(16)

    const {createTournament} = useTournaments()

    const handleCreate = async () => {
        await createTournament(name, date, size)
    }

    return <Dialog open={props.open} onClose={() => props.setOpen(false)}>
        <DialogTitle>
            <DialogContent>
                <Typography variant={"h4"} color={"primary"}>Opret turnering</Typography>
            </DialogContent>
        </DialogTitle>
        <DialogContent>
            <Typography variant={"subtitle2"} className={classes.textLabel}>Navn</Typography>
            <TextField variant={"outlined"}
                       value={name}
                       placeholder={"Turneringsnavn"}
                       className={classes.textField}
                       inputProps={{className: classes.nameInput + " " + (name.length < 2 ? classes.red : classes.green),}}
                       onChange={(e) => setName(e.target.value)}
            />
            <Typography variant={"subtitle2"} className={classes.textLabel}>Størrelse (antal hold)</Typography>
            <TextField variant={"outlined"}
                       value={size}
                       type={"number"}
                       placeholder={"Antal hold"}
                       className={classes.textField}
                       inputProps={{className: classes.nameInput + " " + (name.length < 2 ? classes.red : classes.green)}}
                       onKeyPress={e => e.preventDefault()}
                       onChange={(e) => setSize(parseInt(e.target.value) > size ? size * 2 : size / 2)}
            />
            <Typography variant={"subtitle2"} className={classes.textLabel}>Dato</Typography>
            <div>
                <TextField variant={"outlined"}
                           type={"date"}
                           value={date}
                           placeholder={"Antal hold"}
                           className={classes.textField}
                           inputProps={{className: classes.nameInput + " " + (name.length < 2 ? classes.red : classes.green)}}
                           onChange={e => setDate(e.target.value)}
                />
                <IconButton className={classes.resetDateButton} onClick={() => setDate("")}><Refresh/></IconButton>
            </div>
            {/*{error.length > 0 &&*/}
            {/*    <Typography className={classes.error} color={"secondary"} gutterBottom={false}>{"* " + error}</Typography>}*/}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.setOpen(false)}>Luk</Button>
            <Button color={"primary"} onClick={handleCreate}>Opret</Button>
        </DialogActions>
    </Dialog>
}
