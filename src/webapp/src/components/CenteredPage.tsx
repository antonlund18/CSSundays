import * as React from "react";
import {makeStyles} from "@material-ui/core";
import {PropsWithChildren} from "react";

const useStyles = makeStyles(theme => ({
    page: {
        display: "flex",
        justifyContent: "center",
        height: "calc(100vh - 92px)",
        backgroundColor: "#f5f9fc",
    },
    pageContent: {
        display: "inline",
        width: "1200px",
        padding: theme.spacing(4),
    }
}));

export const CenteredPage = (props: PropsWithChildren<any>): JSX.Element => {
    const classes = useStyles();

    return <div className={classes.page}>
        <div className={classes.pageContent}>
            {props.children}
        </div>
    </div>
}
