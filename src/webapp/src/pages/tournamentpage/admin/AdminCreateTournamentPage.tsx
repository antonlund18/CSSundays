import {IconButton, makeStyles, TextField, Typography} from "@material-ui/core";
import {Refresh} from "@material-ui/icons";
import * as React from "react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTournaments} from "../../../hooks/api/useTournament";
import {CenteredPage} from "../../../components/CenteredPage";

const useStyles = makeStyles(theme => ({
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
    },
    datePicker: {
        width: "calc(100% - 56px)"
    }
}))

export const AdminCreateTournamentPage = (): JSX.Element => {
    const classes = useStyles();
    const navigate = useNavigate()
    const [name, setName] = useState<string>("");
    const [time, setTime] = useState<string>("")
    const [size, setSize] = useState<number>(16)

    const {createTournament} = useTournaments()

    const handleCreate = async () => {
        createTournament(name, time, size).then((data) => navigate("/tournaments/admin"))
    }

    return <CenteredPage>
        <Typography variant={"subtitle2"} className={classes.textLabel}>Navn</Typography>
        <TextField variant={"outlined"}
                   value={name}
                   fullWidth
                   placeholder={"Turneringsnavn"}
                   inputProps={{className: classes.nameInput + " " + (name.length < 2 ? classes.red : classes.green),}}
                   onChange={(e) => setName(e.target.value)}
        />
        <Typography variant={"subtitle2"} className={classes.textLabel}>Størrelse (antal hold)</Typography>
        <TextField variant={"outlined"}
                   value={size}
                   fullWidth
                   type={"number"}
                   placeholder={"Antal hold"}
                   inputProps={{className: classes.nameInput + " " + (name.length < 2 ? classes.red : classes.green)}}
                   onKeyPress={e => e.preventDefault()}
                   onChange={(e) => setSize(parseInt(e.target.value) > size ? size * 2 : size / 2)}
        />
        <Typography variant={"subtitle2"} className={classes.textLabel}>Dato</Typography>
        <>
            <IconButton className={classes.resetDateButton} onClick={() => setTime("")}><Refresh/></IconButton>
        </>
    </CenteredPage>
}