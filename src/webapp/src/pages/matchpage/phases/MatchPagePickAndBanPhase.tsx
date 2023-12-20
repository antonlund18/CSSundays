import * as React from "react"
import {Box, Button, CircularProgress, Typography} from "@mui/material";
import {PlayerPicture} from "../../teamspage/team/PlayerPicture";
import {Test} from "../Test";
import {activeDutyMapPool, CS2Map} from "../../../util/MapPool";
import {useEffect, useState} from "react";
import {makeStyles} from "@mui/styles";
import {User} from "../../../codegen/generated-types";

const useStyles = makeStyles(theme => ({
    mapButton: {
        "&:hover": {
            transform: "scale(1.2)"
        },
        "&.MuiButtonBase-root:disabled": {
            boxShadow: "inset 0 0 0 1000px rgba(0,0,0,.8)",
            color: "rgba(255, 255, 255, 0.2)"
        },
        width: "100%",
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
    },
    mapContainer: {
        width: "14%",
        height: "100%",
        overflow: "hidden",
    },
    captainAndCountdownContainer: {
        height: "64px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        marginTop: "16px",
        marginBottom: "16px"
    },
    captainContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "33%"
    },
    captainSpinner: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    captain: {
        top: "-25%",
        left: "-25%",
        position: "absolute",
        width: "100%",
        height: "100%"
    }
}))

type MatchPageMapPickPhaseProps = {
    team1Captain: User | undefined
    team2Captain: User | undefined
}

export const MatchPagePickAndBanPhase = (props: MatchPageMapPickPhaseProps) => {
    const COUNTDOWN_TIME = 1000 * 20 // 20 seconds
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

    return <>
        <div className={classes.captainAndCountdownContainer}>
            <div className={classes.captainContainer}>
                {count % 2 === 0 &&
                    <Box className={classes.captainSpinner}>
                        <CircularProgress style={{zIndex: 100}}/>
                        {props.team1Captain &&
                            <Box className={classes.captain}>
                                <PlayerPicture player={props.team1Captain} style={{width: "150%", padding: 0}}/>
                            </Box>}
                    </Box>}
            </div>
            <div style={{display: "flex", justifyContent: "center", width: "33%"}}>
                <Test countdown={countdownInSeconds}/>
            </div>
            <div className={classes.captainContainer}>
                {count % 2 === 1 &&
                    <Box className={classes.captainSpinner}>
                        <CircularProgress style={{zIndex: 100}}/>
                        {props.team1Captain &&
                            <Box className={classes.captain}>
                                <PlayerPicture player={props.team1Captain} style={{width: "150%", padding: 0}}/>
                            </Box>}
                    </Box>}
            </div>
        </div>
        <div style={{flex: 1, overflow: "hidden"}}>
            <div style={{height: "100%", display: "flex"}}>
                {activeDutyMapPool.map(map => {
                    return <Button
                        className={classes.mapButton}
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
        </div>
    </>
}