import * as React from "react";
import {Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {useCounterSubscription} from "../../codegen/generated-types";

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
    const {data, loading, error} = useCounterSubscription({variables: {limit: 4}})

    if (loading) {
        console.log("loading")
        return <></>
    }

    if (error) {
        console.log(error)
        return <></>
    }

    if (!data) {
        console.log("no data")
        return <></>
    }

    console.log(data)

    return <div className={classes.homePageContainer}>
        <div className={classes.nameContainer}>
            <Typography variant={"h1"} style={{color: "white"}}>CS</Typography>
            <Typography variant={"h1"} color={"primary"}>SUNDAYS</Typography>
        </div>
        <Typography style={{color: "white"}}>De fedeste Counter-Strike turneringer</Typography>
    </div>
}