import * as React from "react";
import {Button, TextField, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {useState} from "react";
import {theme} from "../theme/theme";
import {useMutateUser} from "../hooks/api/useUser";

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
    const {loginUser} = useMutateUser();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const signUserIn = () => {
        setPassword("");

        loginUser(email, password).then(() => {
                props.setDialogOpen(false);
                setError("");
            })
    }

    return <React.Fragment>
        <Typography variant={"subtitle2"}>E-mail</Typography>
        <TextField variant={"outlined"}
                   value={email}
                   placeholder={"Indtast din e-mail"}
                   className={classes.loginTextField}
                   inputProps={{className: classes.loginInput}}
                   onChange={(e) => setEmail(e.target.value)}
        />

        <Typography variant={"subtitle2"} className={classes.passwordLabel}>Password</Typography>
        <TextField variant={"outlined"}
                   value={password}
                   placeholder={"Indtast dit password"}
                   className={classes.loginTextField}
                   type={"password"}
                   inputProps={{className: classes.loginInput}}
                   onChange={(e) => setPassword(e.target.value)}
        />

        <Button className={classes.loginButton} onClick={() => signUserIn()}>
            <Typography variant={"subtitle2"} style={{color: "white"}}>Log ind</Typography>
        </Button>

        {error.length > 0 ? <Typography style={{marginTop: theme.spacing(1), color: "red"}}>{"* " + error}</Typography> : <></>}
    </React.Fragment>
}