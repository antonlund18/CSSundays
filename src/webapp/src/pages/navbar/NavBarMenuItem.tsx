import * as React from "react";
import {makeStyles, MenuItem, Typography} from "@material-ui/core";
import {NavBarMenuItemWrapper} from "./NavBarMenuItemWrapper";

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
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        width: "92px",
        height: "92px",
    }
}));

type WithOnClick = {
    onClick: (e: React.MouseEvent<HTMLElement>) => void
    link?: undefined
}

type WithLink = {
    link: string
    onClick?: undefined
}

type NavBarMenuItemProps = { text?: string } & (WithLink | WithOnClick)

export const NavBarMenuItem = (props: React.PropsWithChildren<NavBarMenuItemProps>): JSX.Element => {
    const classes = useStyles();

    return <NavBarMenuItemWrapper link={props.link}>
        <MenuItem className={classes.navBarItemContainer} onClick={props.onClick}>
            {props.children}
        </MenuItem>
    </NavBarMenuItemWrapper>
}