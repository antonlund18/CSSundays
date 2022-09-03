import * as React from "react";
import {makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    bottomTextContainer: {
        display: "inline-flex",
    },
    registerText: {
        color: "white",
        fontWeight: "bold",
        fontStyle: "italic",
        cursor: "pointer",
    }
}));

interface LoginHeadingProps {
    isLogin: boolean,
    setIsLogin: (isLogin: boolean) => void,
}

export const LoginHeading = (props: LoginHeadingProps): JSX.Element => {
    const classes = useStyles();

    return <React.Fragment>
        {props.isLogin ?
            <React.Fragment>
                <div>
                    <Typography variant={"h1"} style={{color: "white"}}>Velkommen tilbage!</Typography>
                </div>
                <div className={classes.bottomTextContainer}>
                    <Typography style={{color: "white"}}>Har du ikke en konto?</Typography>
                    <Typography className={classes.registerText} onClick={() => props.setIsLogin(false)}>Tilmeld dig nu!</Typography>
                </div>
            </React.Fragment>
            :
            <React.Fragment>
                <div>
                    <Typography variant={"h1"} style={{color: "white"}}>Velkommen!</Typography>
                </div>
                <div className={classes.bottomTextContainer}>
                    <Typography style={{color: "white"}}>Efter du har tilmeldt dig, vil du modtage en bekræftelsesmail med et link til at aktivere din konto.</Typography>
                </div>
            </React.Fragment>
        }
    </React.Fragment>
}