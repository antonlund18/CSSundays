import * as React from "react"
import {makeStyles} from "@mui/styles";
import {MatchPhase, User} from "../../../codegen/generated-types";
import {Box, CircularProgress, Grid, Typography} from "@mui/material";
import {PlayerPicture} from "../../teamspage/team/PlayerPicture";
import {Check} from "@mui/icons-material";
import {useEffect, useState} from "react";

const useStyles = makeStyles(theme => ({
    captain: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
    },
    captainSpinner: {
        marginLeft: "16px",
        marginRight: "16px"
    }
}))

type MatchPageReadyCheckPhaseProps = {
    phase: MatchPhase
    team1Captain: User | undefined
    team2Captain: User | undefined
}

export const MatchPageReadyCheckPhase = (props: MatchPageReadyCheckPhaseProps) => {
    const classes = useStyles()
    const [countdown, setCountdown] = useState<number | null>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            const endTime = new Date(props.phase.endTs).getTime()
            const currentTime = new Date().getTime()
            const deltaTimeInSeconds = (endTime - currentTime) / 1000

            if (deltaTimeInSeconds > 0) {
                setCountdown(deltaTimeInSeconds);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [props.phase.endTs])

    const addStartZero = (countdown: String | undefined) => {
        if (!countdown) return `00`
        if (countdown.length === 1) return `0${countdown}`
        return countdown
    }

    const seconds = countdown ? parseInt(String(countdown % 60)) : 0
    const minutes = countdown ? parseInt(String(countdown / 60)) : 0
    const countdownString = countdown !== null ? `${addStartZero(minutes?.toString())}:${addStartZero(seconds?.toString())}` : ""

    return <Grid container sx={{height: "100%", justifyContent: "center", alignItems: "center"}}>
        <Grid item xs={4} sx={{display: "flex", justifyContent: "center"}}>
            {props.team1Captain &&
                <Box className={classes.captain}>
                    <PlayerPicture player={props.team1Captain} style={{width: "100px"}}/>
                    <Box className={classes.captainSpinner}>
                        <CircularProgress style={{zIndex: 100}}/>
                    </Box>
                </Box>}
        </Grid>
        <Grid item xs={4} sx={{textAlign: "center"}}>
            <Typography variant={"h2"}>Venter på hold bliver klar</Typography>
            {countdown && countdown > 0 && <Typography variant={"h2"}>{countdownString}</Typography>}
        </Grid>
        <Grid item xs={4} sx={{display: "flex", justifyContent: "center"}}>
            {props.team2Captain &&
                <Box className={classes.captain}>
                    <Box className={classes.captainSpinner}>
                        <Check style={{fontSize: "48px", color: "#39c900"}}/>
                    </Box>
                    <PlayerPicture player={props.team2Captain} style={{width: "100px"}}/>
                </Box>}
        </Grid>
    </Grid>
}