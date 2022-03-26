import * as React from "react";
import {Button, makeStyles, TextField, Typography} from "@material-ui/core";
import {useState} from "react";
import {useAuth} from "../firebase/authentication/AuthContext";
import {theme} from "../theme/theme";

const useStyles = makeStyles(theme => ({
    loginTextField: {
        paddingTop: theme.spacing(1),
    },
    loginInput: {
        "&:focus": {
            borderColor: theme.palette.primary.main,
        },
        transition: "border-color .2s ease-in-out",
    },
    passwordLabel: {
        marginTop: theme.spacing(1),
    },
    loginButton: props => ({
        height: "46px",
        borderRadius: "200px",
        backgroundColor: theme.palette.primary.main,
        marginTop: theme.spacing(3),
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        }
    }),
}));

interface LoginFormProps {
    isLogin: boolean;
    setDialogOpen: (open: boolean) => void;
}

export const LoginForm = (props: LoginFormProps): JSX.Element => {
    const classes = useStyles();
    const auth = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const getErrorMessage = (authError: any) => {
        if (authError.code === "auth/invalid-email") {
            setError("Ugyldig e-mail");
            return;
        }
        if (authError.code === "auth/too-many-requests") {
            setError("For mange forsøg. Vent venligst, og prøv igen");
            return;
        }
        setError("Login mislykkedes. Prøv igen!");
    }

    const signUserIn = () => {
        setPassword("");

        auth.login(email, password)
            .then(() => {
                props.setDialogOpen(false);
                setError("");
            })
            .catch((authError) => {
                getErrorMessage(authError);
            })
        ;
    }

    return <React.Fragment>
        <Typography variant={"subtitle2"}>E-mail</Typography>
        <TextField variant={"standard"}
                   value={email}
                   placeholder={"Indtast din e-mail"}
                   className={classes.loginTextField}
                   InputProps={{disableUnderline: true}}
                   inputProps={{className: classes.loginInput}}
                   onChange={(e) => setEmail(e.target.value)}
        />

        <Typography variant={"subtitle2"} className={classes.passwordLabel}>Password</Typography>
        <TextField variant={"standard"}
                   value={password}
                   placeholder={"Indtast dit password"}
                   className={classes.loginTextField}
                   type={"password"}
                   InputProps={{disableUnderline: true}}
                   inputProps={{className: classes.loginInput}}
                   onChange={(e) => setPassword(e.target.value)}
        />

        <Button className={classes.loginButton} onClick={() => signUserIn()}>
            <Typography variant={"subtitle2"} style={{color: "white"}}>Log ind</Typography>
        </Button>

        {error.length > 0 ? <Typography style={{marginTop: theme.spacing(1), color: "red"}}>{"* " + error}</Typography> : <></>}
    </React.Fragment>
}