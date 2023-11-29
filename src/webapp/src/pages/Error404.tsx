import {Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import * as React from "react"

const useStyles = makeStyles({
    container: {
        width: "100%",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
    image: {
        backgroundImage: "url(https://i.ytimg.com/vi/YeIR4ZKZRmg/maxresdefault.jpg)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        width: "800px",
        height: "600px",
        backgroundPosition: "75%, 100%"
    }
})

export const Error404 = () => {
    const classes = useStyles()

    return <div className={classes.container}>
        <div className={classes.image}/>
        <Typography variant={"h1"}>404</Typography>
        <Typography variant={"subtitle2"}>Denne side findes ikke</Typography>
    </div>
}