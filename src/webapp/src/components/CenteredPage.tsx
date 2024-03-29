import * as React from "react";
import {Theme} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {PropsWithChildren} from "react";

interface StylesProps {
    fullWidth?: boolean
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    page: {
        display: "flex",
        justifyContent: "center",
        minHeight: "calc(100vh - 92px)",
    },
    pageImage: {
        position: "relative",
        height: "calc(100vh - 92px)",
        content: "''",
        backgroundImage: "url(https://i.imgur.com/MkE9cBw.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflowY: "scroll",
    },
    pageContent: props => ({
        "&::-webkit-scrollbar": {
            width: "0px"
        },
        display: "inline",
        margin: "16px",
        width: props.fullWidth ? "" : "1200px",
        backgroundColor: "rgba(245,249,252, .8)",
        backgroundSize: "100vw",
        padding: theme.spacing(4),
        borderRadius: "8px",
    }),
}));

interface CenteredPageProps {
    fullWidth?: boolean
}

export const CenteredPage = (props: PropsWithChildren<CenteredPageProps>): JSX.Element => {
    const classes = useStyles({fullWidth: props.fullWidth});

    return <div className={classes.pageImage}>
        <div className={classes.page}>
            <div className={classes.pageContent}>
                {props.children}
            </div>
        </div>
    </div>
}
