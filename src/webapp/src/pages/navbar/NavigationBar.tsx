import * as React from "react";
import {Link} from "react-router-dom";
import {makeStyles, Typography} from "@material-ui/core";
import {NavBarProfile} from "./NavBarProfile";
import {NavBarMenuItem} from "./NavBarMenuItem";
import "../../css/style.min.css";

const useStyles = makeStyles({
    navBarContainer: {
        height: "92px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "0 32px",
        boxSizing: "border-box"
    },
    logoTitleText: {
        "&:visited": {
            color: "inherit"
        },
        display: "inline-flex",
        textDecoration: "none",
    },
    navigationMenu: {
        display: "flex",
    },
    navigationMenuItemText: {
        textTransform: "capitalize",
    }
});

export const NavigationBar = (): JSX.Element => {
    const classes = useStyles();

    return <div className={classes.navBarContainer}>
        <Link to={"/"} className={classes.logoTitleText}>
            <Typography variant={"h2"}>CS</Typography>
            <Typography variant={"h2"} color={"primary"}>Sundays</Typography>
        </Link>
        <div className={classes.navigationMenu}>
            <NavBarMenuItem link={"/"}>
                <Typography variant={"button"} className={classes.navigationMenuItemText}>Home</Typography>
            </NavBarMenuItem>
            <NavBarMenuItem link={"/tournaments"}>
                <Typography variant={"button"} style={{textTransform: "capitalize"}}>Turneringer</Typography>
            </NavBarMenuItem>
            <NavBarMenuItem link={"/teams"}>
                <Typography variant={"button"} style={{textTransform: "capitalize"}}>Hold</Typography>
            </NavBarMenuItem>
        </div>
        <NavBarProfile/>
    </div>
}