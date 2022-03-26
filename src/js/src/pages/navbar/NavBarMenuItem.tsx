import * as React from "react";
import {makeStyles, MenuItem, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    navBarItemContainer: {
        "&:before": {
            backgroundColor: theme.palette.primary.main,
            height: "4px",
            width: "100%",
            content: "''",
            opacity: 0,
            position: "absolute",
            top: 0,
            left: "-100%",
            transition: "all .3s ease-in-out",
        },
        "&:hover:before": {
            opacity: 1,
            left: 0,
        },
        padding: 0,
    },
    navBarItemText: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        lineHeight: "92px",
        width: "92px",
        textTransform: "capitalize",
        transition: "all .3s ease-in-out",
        "&:hover": {
            backgroundColor: "#f5f9fc",
        }
    }
}));

interface NavBarMenuItemProps {
    text: string
    link: string
}

export const NavBarMenuItem = (props: NavBarMenuItemProps): JSX.Element => {
    const classes = useStyles();

    return <Link to={props.link}>
        <MenuItem className={classes.navBarItemContainer}>
            <Typography variant={"button"} className={classes.navBarItemText}>{props.text}</Typography>
        </MenuItem>
    </Link>
}