import * as React from "react";
import {useContext, useState} from "react";
import {Button, TextField, Tooltip, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {useMutateUser} from "../hooks/api/useUser";
import {Strings} from "../util/Strings";
import {ErrorOutline} from "@mui/icons-material";
import {SnackbarContext} from "../SnackbarContextProvider";
import {ApolloError} from "@apollo/client";
import {Errors} from "../util/Errors";

const useStyles = makeStyles(theme => ({
    inputLabel: {
        marginTop: theme.spacing(1),
    },
    loginTextField: {
        paddingTop: theme.spacing(1),
        whiteSpace: "pre-wrap"
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
        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.secondary.main,

        },
    },
    green: {
        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
    const [errors, setErrors] = useState<number[]>([]);
    const {openSnackbar} = useContext(SnackbarContext)


    const handleRegistration = () => {
        createUser(username, email, password, confirmPassword).then(() => {
            props.setDialogOpen(false);
            openSnackbar("Velkommen til CSSundays!", "success")
        }).catch((e: ApolloError) => {
            const gqlErrors: number[] = e.graphQLErrors.map(error => error.extensions.errorCode as number)
            setErrors(errors => [...errors, ...gqlErrors])
            openSnackbar("Vi kunne ikke oprette dig som bruger. Ret fejlene og prøv igen.", "error")
        })
        clearFields();
    };

    const clearFields = () => {
        setErrors([]);
    }

    const invalidPassword = errors.includes(Errors.INVALID_PASSWORD)
    const invalidEmail = errors.includes(Errors.INVALID_EMAIL)
    const invalidPlayertag = errors.includes(Errors.INVALID_PLAYERTAG)
    const emailInUse = errors.includes(Errors.EMAIL_IN_USE)
    const playertagInUse = errors.includes(Errors.PLAYERTAG_IN_USE)
    const passwordsNotMatching = errors.includes(Errors.PASSWORDS_NOT_MATCHING)

    return <React.Fragment>
        <Typography variant={"subtitle2"}>E-mail</Typography>
        <TextField placeholder={"Indtast din e-mail"}
                   variant={"outlined"}
                   className={classes.loginTextField}
                   error={invalidEmail || emailInUse}
                   helperText={(invalidEmail ? "*Ugyldig e-mail\n" : "") + (emailInUse ? "*E-mail i brug" : "")}
                   InputProps={{className: classes.registerInput + " " + (new RegExp(/^\S+@\S+\.\S+/).test(email) ? classes.green : classes.red)}}
                   onChange={(e) => setEmail(e.target.value)}
        />

        <Typography variant={"subtitle2"} className={classes.inputLabel}>Brugernavn</Typography>
        <TextField placeholder={"Vælg dit brugernavn"}
                   variant={"outlined"}
                   className={classes.loginTextField}
                   error={invalidPlayertag || playertagInUse}
                   helperText={(invalidPlayertag ? "*Ugyldigt brugernavn\n" : "") + (playertagInUse ? "*Brugernavn i brug" : "")}
                   InputProps={{className: classes.registerInput + " " + (new RegExp(/^[a-zA-Z0-9æøåÆØÅ!@$#%&,]{2,16}$/).test(username) ? classes.green : classes.red)}}
                   onChange={(e) => setUsername(e.target.value)}
        />


        <div style={{display: "flex", alignItems: "center", marginTop: "8px"}}>
            <Typography variant={"subtitle2"}>Password</Typography>
            <Tooltip title={<span style={{whiteSpace: "pre-wrap"}}>{Strings.PASSWORD_REQUIREMENTS}</span>} arrow
                     placement={"right"}>
                <ErrorOutline sx={{marginLeft: "4px", fontSize: "14px"}}/>
            </Tooltip>
        </div>
        <TextField type={"password"}
                   variant={"outlined"}
                   value={password}
                   placeholder={"Indtast dit password"}
                   className={classes.loginTextField}
                   error={invalidPassword}
                   helperText={invalidPassword && "*Ugyldigt kodeord"}
                   InputProps={{className: classes.registerInput + " " + (new RegExp(/^[a-zA-Z0-9æøåÆØÅ!@$#%&,]{6,32}$/).test(password) ? classes.green : classes.red)}}
                   onChange={(e) => setPassword(e.target.value)}
        />

        <Typography variant={"subtitle2"} className={classes.inputLabel}>Bekræft password</Typography>
        <TextField type={"password"}
                   variant={"outlined"}
                   value={confirmPassword}
                   placeholder={"Indtast dit password igen"}
                   className={classes.loginTextField}
                   error={passwordsNotMatching}
                   helperText={passwordsNotMatching && "*Kodeord er ikke ens"}
                   InputProps={{className: classes.registerInput + " " + (password === confirmPassword ? classes.green : classes.red)}}
                   onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button className={classes.registerButton} onClick={() => handleRegistration()}>
            <Typography variant={"subtitle2"} style={{color: "white"}}>Tilmeld</Typography>
        </Button>
    </React.Fragment>
}