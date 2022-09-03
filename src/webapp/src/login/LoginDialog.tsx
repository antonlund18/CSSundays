import * as React from "react";
import {useState} from "react";
import {Dialog, makeStyles, Theme} from "@material-ui/core";
import {LoginHeading} from "./LoginHeading";
import {LoginFormBody} from "./LoginFormBody";

interface LoginDialogProps {
    setOpen: (open: boolean) => void,
}

interface StylesProps {
    isLogin: boolean;
}

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
    typography: {
        white: {
            fontWeight: "bold",
        }
    },
    loginDialogContainer: {
        display: "flex",
        width: "800px",
        maxWidth: "90vw",
        backgroundColor: "white",
        overflow: "hidden",
    },
    rightContainer: {
        width: "55%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    leftContainer: props => ({
        width: "45%",
        background: props.isLogin ? "linear-gradient(45deg, #1c59f3, #00d8ff)" : "linear-gradient(45deg, #420ed9, #ff055d)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: theme.spacing(3),
    }),
}));

export const LoginDialog = (props: LoginDialogProps): JSX.Element => {
    const [isLoginTabSelected, setIsLoginTabSelected] = useState<boolean>(true);
    const styleProps = {isLogin: isLoginTabSelected}
    const classes = useStyles(styleProps);

    return <Dialog open={true}
                   onClose={() => props.setOpen(false)}
                   maxWidth={"xl"}>
        <div className={classes.loginDialogContainer}>
            <div className={classes.leftContainer}>
                {<LoginHeading isLogin={isLoginTabSelected} setIsLogin={setIsLoginTabSelected}/>}
            </div>

            <div className={classes.rightContainer}>
                {<LoginFormBody isLogin={isLoginTabSelected} setIsLoginTabSelected={setIsLoginTabSelected} setDialogOpen={props.setOpen}/>}
            </div>
        </div>
    </Dialog>
}