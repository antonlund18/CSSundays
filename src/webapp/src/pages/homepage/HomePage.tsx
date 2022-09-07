import * as React from "react";
import {makeStyles, Typography} from "@material-ui/core";
import {useGetUserById} from "../../hooks/api/useUser";

const useStyles = makeStyles((theme) => ({
    homePageContainer: {
        overflow: "hidden",
        width: "100vw",
        height: "calc(100vh - 92px)",
        backgroundImage: "url(https://i.imgur.com/MkE9cBw.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    nameContainer: {
        display: "inline-flex",
    }
}));

export const HomePage = () => {
    const classes = useStyles();

    const {user} = useGetUserById(7);

    console.log(user)

    return <div className={classes.homePageContainer}>
        <div className={classes.nameContainer}>
            <Typography variant={"h1"} style={{color: "white"}}>CS</Typography>
            <Typography variant={"h1"} color={"primary"}>SUNDAYS</Typography>
        </div>
        <Typography style={{color: "white"}}>Counter-Strike turneringer hver søndag</Typography>
    </div>
}