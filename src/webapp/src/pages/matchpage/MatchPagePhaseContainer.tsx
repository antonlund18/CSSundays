import * as React from "react"
import {useEffect, useState} from "react"
import {Button, Grid, Typography} from "@mui/material";
import {activeDutyMapPool, CS2Map} from "../../util/MapPool";
import {makeStyles} from "@mui/styles";
import {Circle} from "@mui/icons-material";
import {Test} from "./Test";

const useStyles = makeStyles(theme => ({
    mapContainer: {
        "& div:first-child:hover": {
            transform: "scale(1.2)"
        },
        "&.MuiButtonBase-root:disabled": {
            boxShadow: "inset 0 0 0 1000px rgba(0,0,0,.8)",
            color: "rgba(255, 255, 255, 0.2)"
        },
        width: "14%",
        overflow: "hidden",
        padding: 0,
        borderRadius: 0,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "all .5s",
        backgroundSize: "cover",
        textShadow: "#000000 0px 0px 10px",
        color: "rgba(255, 255, 255, 1)"
    }
}))

export const MatchPagePhaseContainer = () => {
    const COUNTDOWN_TIME = 1000 * 20
    const classes = useStyles()
    const [count, setCount] = useState(0)
    const [bannedMaps, setBannedMaps] = useState<CS2Map[]>([])
    const [countdownDate, setCountdownDate] = useState<number>(new Date().getTime() + COUNTDOWN_TIME)
    const [countdown, setCountDown] = useState<number>(new Date().getTime() - countdownDate);

    useEffect(() => {
        const interval = setInterval(() => {
            const newCountdown = countdownDate - new Date().getTime()
            if (newCountdown > 0) {
                setCountDown(countdownDate - new Date().getTime());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [countdownDate]);

    const countdownInSeconds = Math.floor((countdown % (1000 * 60)) / 1000)

    return <Grid item container xs={12}>
        <Grid item container xs={12} sx={{height: "64px", alignItems: "center"}}>
            <Grid item xs={5} style={{display: "flex", justifyContent: "center"}}>
                {count % 2 === 0 && <Circle color={"primary"}/>}
            </Grid>
            <Grid item xs={2} style={{display: "flex", justifyContent: "center"}}>
                <Test countdown={countdownInSeconds}/>
            </Grid>
            <Grid item xs={5} style={{display: "flex", justifyContent: "center"}}>
                {count % 2 === 1 && <Circle color={"error"}/>}
            </Grid>
        </Grid>
        <div style={{width: "100%", height: "30vh", display: "flex", justifyContent: "center"}}>
            {activeDutyMapPool.map(map => {
                return <Button
                    className={classes.mapContainer}
                    onClick={() => {
                        setBannedMaps([...bannedMaps, map])
                        setCount(count + 1)
                        setCountdownDate(new Date().getTime() + COUNTDOWN_TIME)
                    }}
                    disabled={bannedMaps.includes(map)}
                    style={{backgroundImage: `url(${map.picture})`}}>
                    <Typography variant={"h2"}>{map.label}</Typography>
                </Button>
            })}
        </div>
    </Grid>
}