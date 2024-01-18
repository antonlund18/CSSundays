import * as React from "react";
import {useContext, useState} from "react";
import {Button, TextField, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {theme} from "../theme/theme";
import {Constants} from "../util/Constants";
import {useLoginUserMutation} from "../codegen/generated-types";
import {SnackbarContext} from "../SnackbarContextProvider";
import {ApolloError} from "@apollo/client";
import {Errors} from "../util/Errors";

const useStyles = makeStyles(theme => ({
    loginTextField: {
        paddingTop: theme.spacing(1),
    },
    loginInput: {
        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
    const [loginUser] = useLoginUserMutation();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<number[]>([]);
    const {openSnackbar} = useContext(SnackbarContext)

    const signUserIn = () => {
        setPassword("");

        return loginUser({
            variables: {
                email,
                password
            }
        }).then((data) => {
            localStorage.setItem(Constants.JWT_TOKEN, data.data?.loginUser ?? "");
            window.location.reload()
        }).catch((errors: ApolloError) => {
            openSnackbar("Login fejlede", "error")
            const gqlErrors: number[] = errors.graphQLErrors.map(error => error.extensions.errorCode as number)
            setErrors(errors => [...errors, ...gqlErrors])
        })
    }

    const isIncorrectLogin = errors.includes(Errors.INCORRECT_LOGIN)

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

        {isIncorrectLogin &&
            <Typography style={{marginTop: theme.spacing(1), color: "red"}}>
                {"*Forkert brugernavn eller adgangskode. Prøv igen"}
            </Typography>}
    </React.Fragment>
}