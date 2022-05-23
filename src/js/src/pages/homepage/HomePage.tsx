import * as React from "react";
import {makeStyles, Typography} from "@material-ui/core";
import {usePlayer} from "../../hooks/api/usePlayer";
import {useCreateTeam} from "../../hooks/api/useTeam";
import {useEffect} from "react";

const useStyles = makeStyles((theme) => ({
    homePageContainer: {
        overflow: "hidden",
        width: "100vw",
        height: "calc(100vh - 92px)",
        backgroundImage: "url(https://i.imgur.com/3oY7Tm1.png)",
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
    const getPlayerById = usePlayer(1);
    const [createTeam] = useCreateTeam();
    console.log(getPlayerById.data);


    const classes = useStyles();

    return <div className={classes.homePageContainer}>
        <div className={classes.nameContainer}>
            <Typography variant={"h1"} style={{color: "white"}}>CS</Typography>
            <Typography variant={"h1"} color={"primary"}>SUNDAYS</Typography>
        </div>
        <Typography style={{color: "white"}}>Counter-Strike turneringer hver søndag</Typography>
    </div>
}