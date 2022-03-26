import * as React from "react";
import {Link} from "react-router-dom";
import "../../css/style.min.css";
import {makeStyles, Typography} from "@material-ui/core";
import {NavBarProfile} from "./NavBarProfile";
import {NavBarMenuItem} from "./NavBarMenuItem";

const useStyles = makeStyles({
    navBarContainer: {
        height: "92px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "0 32px",
    },
    logoTitleText: {
        display: "inline-flex",
    },
    navigationMenu: {
        display: "flex",

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
            <NavBarMenuItem text={"Home"} link={"/"}/>
            <NavBarMenuItem text={"Turneringer"} link={"/tournaments"}/>
            <NavBarMenuItem text={"Hold"} link={"/teams"}/>
        </div>
        <NavBarProfile/>
    </div>
}