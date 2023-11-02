import * as React from "react";
import {useState} from "react";
import {Button, TextField, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {theme} from "../theme/theme";
import {useMutateUser} from "../hooks/api/useUser";

const useStyles = makeStyles(theme => ({
    inputLabel: {
        marginTop: theme.spacing(1),
    },
    loginTextField: {
        paddingTop: theme.spacing(1),
    },
    registerButton: {
        height: "46px",
        borderRadius: "200px",
        backgroundColor: theme.palette.secondary.main,
        marginTop: theme.spacing(3),
        "&:hover": {
            backgroundColor: theme.palette.secondary.light,
        }
    },
    registerInput: {
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
}));

interface RegisterFormProps {
    setDialogOpen: (open: boolean) => void;
}

export const RegisterForm = (props: RegisterFormProps): JSX.Element => {
    const classes = useStyles();
    const {createUser} = useMutateUser();

    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const validateCredentials = (authError: any) => {
        if (authError.code === "auth/email-already-in-use") {
            setError("Der findes allerede en bruger med denne e-mail");
            return;
        }
        if (authError.code === "auth/invalid-email") {
            setError("Du har indtastet en ugyldig e-mail");
            return;
        }
        if (password.length === 0 || authError.code === "auth/weak-password") {
            setError("Dit kodeord skal mindst være 6 tegn");
            return;
        }
        setError("Der skete en fejl. Prøv igen");
    }

    const handleRegistration = () => {
        if (password !== confirmPassword) {
            setError("De to passwords er ikke ens");
            return;
        }

        if (username.length < 3) {
            setError("Dit brugernavn skal mindst være 3 tegn");
            return;
        }


        createUser(username, email, password).then(() => {
            props.setDialogOpen(false);
        }).then(() => window.location.reload())

        clearFields();
    };

    const clearFields = () => {
        setError("");
        setPassword("");
        setConfirmPassword("");
    }

    return <React.Fragment>
        <Typography variant={"subtitle2"}>E-mail</Typography>
        <TextField placeholder={"Indtast din e-mail"}
                   variant={"outlined"}
                   className={classes.loginTextField}
                   inputProps={{className: classes.registerInput + " " + (new RegExp(/^\S+@\S+\.\S+/).test(email) ? classes.green : classes.red)}}
                   onChange={(e) => setEmail(e.target.value)}
        />

        <Typography variant={"subtitle2"} className={classes.inputLabel}>Brugernavn</Typography>
        <TextField placeholder={"Vælg dit brugernavn"}
                   variant={"outlined"}
                   className={classes.loginTextField}
                   inputProps={{className: classes.registerInput + " " + (username.length < 3 ? classes.red : classes.green)}}
                   onChange={(e) => setUsername(e.target.value)}
        />

        <Typography variant={"subtitle2"} className={classes.inputLabel}>Password</Typography>
        <TextField type={"password"}
                   variant={"outlined"}
                   value={password}
                   placeholder={"Indtast dit password"}
                   className={classes.loginTextField}
                   inputProps={{className: classes.registerInput + " " + (password.length > 5 ? classes.green : classes.red)}}
                   onChange={(e) => setPassword(e.target.value)}
        />

        <Typography variant={"subtitle2"} className={classes.inputLabel}>Bekræft password</Typography>
        <TextField type={"password"}
                   variant={"outlined"}
                   value={confirmPassword}
                   placeholder={"Indtast dit password igen"}
                   className={classes.loginTextField}
                   inputProps={{className: classes.registerInput + " " + (confirmPassword.length > 5 && password === confirmPassword ? classes.green : classes.red)}}
                   onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button className={classes.registerButton} onClick={() => handleRegistration()}>
            <Typography variant={"subtitle2"} style={{color: "white"}}>Tilmeld</Typography>
        </Button>

        {error.length > 0 ?
            <Typography style={{marginTop: theme.spacing(1), color: "red"}}>{"* " + error}</Typography> : <></>}
    </React.Fragment>
}