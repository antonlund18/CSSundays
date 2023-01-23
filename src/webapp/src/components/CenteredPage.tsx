import * as React from "react";
import {makeStyles, Theme} from "@material-ui/core";
import {PropsWithChildren} from "react";

interface StylesProps {
    fullWidth?: boolean
}

const useStyles = makeStyles<Theme, StylesProps>(theme  => ({
    page: {
        display: "flex",
        justifyContent: "center",
        height: "calc(100vh - 92px)",
        backgroundColor: "#f5f9fc",
    },
    pageContent: props => ({
        display: "inline",
        width: props.fullWidth ? "" : "1200px",
        padding: theme.spacing(4),
    })
}));

interface CenteredPageProps {
    fullWidth?: boolean
}

export const CenteredPage = (props: PropsWithChildren<CenteredPageProps>): JSX.Element => {
    const classes = useStyles({fullWidth: props.fullWidth});

    return <div className={classes.page}>
        <div className={classes.pageContent}>
            {props.children}
        </div>
    </div>
}
