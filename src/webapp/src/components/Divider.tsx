import * as React from "react";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material";

interface StylesProps {
    color?: string
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    titleSeparator: props => ({
        "&:before": {
            position: "absolute",
            content: "''",
            width: "70px",
            height: "3px",
            backgroundColor: props.color ? props.color : theme.palette.primary.main,
            top: "-2px",
        },
        position: "relative",
        marginTop: theme.spacing(1),
        height: "1px",
        backgroundColor: "#dbdbdb",
        marginBottom: theme.spacing(4),
    }),
}));

interface DividerProps {
    color?: string
}

export const Divider = (props: DividerProps): JSX.Element => {
    const classes = useStyles(props);

    return <div className={classes.titleSeparator}/>
}