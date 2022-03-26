import * as React from "react";
import {Button, makeStyles, Theme, Typography} from "@material-ui/core";
import {LoginForm} from "./LoginForm";
import {RegisterForm} from "./RegisterForm";
import {Divider} from "../components/Divider";
import {theme} from "../theme/theme";

const useStyles = makeStyles<Theme>(theme => ({
    loginForm: {
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    loginTabContainer: {
        width: "100%",
    },
    loginTab: {
        ":&last-child": {
            borderRight: "none",
        },
        borderRadius: 0,
        height: "64px",
        width: "50%",
        borderTop: "1px solid #dbdbdb",
        borderRight: "1px solid #dbdbdb",
    },
    loginTabNoHover: {
        "&:hover": {
            backgroundColor: "transparent",
        }
    }
}));

interface LoginFormBodyProps {
    isLogin: boolean;
    setIsLoginTabSelected: (isLoginSelected: boolean) => void;
    setDialogOpen: (open: boolean) => void;
}

export const LoginFormBody = (props: LoginFormBodyProps): JSX.Element => {
    const stylesProps = {isLogin: props.isLogin};
    const classes = useStyles(stylesProps);

    return <React.Fragment>
        <div className={classes.loginForm}>
            <Typography variant={"subtitle1"}>{props.isLogin ? "Log ind" : "Tilmeld dig"}</Typography>
            <Divider color={props.isLogin ? undefined : theme.palette.secondary.main}/>

            {props.isLogin ? <LoginForm isLogin={props.isLogin} setDialogOpen={props.setDialogOpen}/> : <RegisterForm setDialogOpen={props.setDialogOpen}/>}
        </div>
        <div className={classes.loginTabContainer}>
            {props.isLogin ?
                <React.Fragment>
                    <Button className={classes.loginTab + " " + classes.loginTabNoHover}
                            onClick={() => props.setIsLoginTabSelected(true)}>
                        <Typography variant={"subtitle2"}>Log Ind</Typography>
                    </Button>
                    <Button className={classes.loginTab} onClick={() => props.setIsLoginTabSelected(false)}>
                        <Typography variant={"subtitle2"} style={{fontWeight: 400}}>Tilmeld</Typography>
                    </Button>
                </React.Fragment>
                :
                <React.Fragment>
                    <Button className={classes.loginTab} onClick={() => props.setIsLoginTabSelected(true)}>
                        <Typography variant={"subtitle2"} style={{fontWeight: 400}}>Log Ind</Typography>
                    </Button>
                    <Button className={classes.loginTab + " " + classes.loginTabNoHover}
                            onClick={() => props.setIsLoginTabSelected(false)}>
                        <Typography variant={"subtitle2"}>Tilmeld</Typography>
                    </Button>
                </React.Fragment>
            }
        </div>
    </React.Fragment>
}