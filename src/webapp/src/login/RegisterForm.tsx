import * as React from "react";
import {useState} from "react";
import {Button, TextField, Tooltip, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {theme} from "../theme/theme";
import {useMutateUser} from "../hooks/api/useUser";
import {Strings} from "../util/Strings";
import {ErrorOutline} from "@mui/icons-material";

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
    const [errors, setErrors] = useState<string[]>([]);


    const handleRegistration = () => {
        let errorsAccumulated: string[] = []

        if (username.length < 3) {
            errorsAccumulated = [...errorsAccumulated, "Dit brugernavn skal mindst være 3 tegn"]
        }

        if (password !== confirmPassword) {
            errorsAccumulated = [...errorsAccumulated, "De to passwords er ikke ens"]
        }

        if (!new RegExp(/^\S+@\S+\.\S+/).test(email)) {
            errorsAccumulated = [...errorsAccumulated, "Ugyldig e-mail"]
        }

        if (errorsAccumulated.length > 0) {
            setErrors(errorsAccumulated)
            return
        }

        createUser(username, email, password).then(() => {
            props.setDialogOpen(false);
        }).then(() => window.location.reload())

        clearFields();
    };

    const clearFields = () => {
        setErrors([]);
        setPassword("");
        setConfirmPassword("");
    }

    return <React.Fragment>
        <Typography variant={"subtitle2"}>E-mail</Typography>
        <TextField placeholder={"Indtast din e-mail"}
                   variant={"outlined"}
                   className={classes.loginTextField}
                   InputProps={{className: classes.registerInput + " " + (new RegExp(/^\S+@\S+\.\S+/).test(email) ? classes.green : classes.red)}}
                   onChange={(e) => setEmail(e.target.value)}
        />

        <Typography variant={"subtitle2"} className={classes.inputLabel}>Brugernavn</Typography>
        <TextField placeholder={"Vælg dit brugernavn"}
                   variant={"outlined"}
                   className={classes.loginTextField}
                   InputProps={{className: classes.registerInput + " " + (username.length < 3 ? classes.red : classes.green)}}
                   onChange={(e) => setUsername(e.target.value)}
        />



        <div style={{display: "flex", alignItems: "center", marginTop: "8px"}}>
            <Typography variant={"subtitle2"}>Password</Typography>
            <Tooltip  title={<span style={{whiteSpace: "pre-wrap"}}>{Strings.PASSWORD_REQUIREMENTS}</span>} arrow placement={"right"}>
                <ErrorOutline sx={{marginLeft: "4px", fontSize: "14px"}}/>
            </Tooltip>
        </div>
        <TextField type={"password"}
                   variant={"outlined"}
                   value={password}
                   placeholder={"Indtast dit password"}
                   className={classes.loginTextField}
                   InputProps={{className: classes.registerInput + " " + (password.length > 5 ? classes.green : classes.red)}}
                   onChange={(e) => setPassword(e.target.value)}
        />

        <Typography variant={"subtitle2"} className={classes.inputLabel}>Bekræft password</Typography>
        <TextField type={"password"}
                   variant={"outlined"}
                   value={confirmPassword}
                   placeholder={"Indtast dit password igen"}
                   className={classes.loginTextField}
                   InputProps={{className: classes.registerInput + " " + (confirmPassword.length > 5 && password === confirmPassword ? classes.green : classes.red)}}
                   onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button className={classes.registerButton} onClick={() => handleRegistration()}>
            <Typography variant={"subtitle2"} style={{color: "white"}}>Tilmeld</Typography>
        </Button>

        {errors.length > 0 && errors.map(error => {
            return <Typography style={{marginTop: theme.spacing(1), color: "red"}}>{"* " + error}</Typography>}
        )}
    </React.Fragment>
}