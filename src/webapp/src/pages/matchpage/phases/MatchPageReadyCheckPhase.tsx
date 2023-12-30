import * as React from "react"
import {useEffect, useState} from "react"
import {makeStyles} from "@mui/styles";
import {Match, MatchReadyCheckPhaseState, useMarkReadyMutation, User} from "../../../codegen/generated-types";
import {Box, Button, CircularProgress, Grid, Typography} from "@mui/material";
import {PlayerPicture} from "../../teamspage/team/PlayerPicture";
import {Check} from "@mui/icons-material";
import {useGetCurrentUser} from "../../../hooks/api/useUser";

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
    match: Match
    team1Captain: User | undefined
    team2Captain: User | undefined
}

export const MatchPageReadyCheckPhase = (props: MatchPageReadyCheckPhaseProps) => {
    const classes = useStyles()
    const [countdown, setCountdown] = useState<number | null>(null)
    const {currentUser} = useGetCurrentUser()
    const [markReady] = useMarkReadyMutation()

    const phase = props.match.currentPhase

    useEffect(() => {
        const interval = setInterval(() => {
            const endTime = new Date(phase.endTs).getTime()
            const currentTime = new Date().getTime()
            const deltaTimeInSeconds = (endTime - currentTime) / 1000

            if (deltaTimeInSeconds > 0) {
                setCountdown(deltaTimeInSeconds);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [phase.endTs])

    const addStartZero = (countdown: String | undefined) => {
        if (!countdown) return `00`
        if (countdown.length === 1) return `0${countdown}`
        return countdown
    }

    const seconds = countdown ? parseInt(String(countdown % 60)) : 0
    const minutes = countdown ? parseInt(String(countdown / 60)) : 0
    const countdownString = countdown !== null ? `${addStartZero(minutes?.toString())}:${addStartZero(seconds?.toString())}` : ""

    const state = phase.state as MatchReadyCheckPhaseState

    const isCurrentUserTeamOneCaptain = props.team1Captain?.id === currentUser.id
    const isCurrentUserTeamTwoCaptain = props.team2Captain?.id === currentUser.id

    const handleCaptainReady = () => {
        console.log(phase.match?.id)
        if (!phase.match?.id || !currentUser.id) {
            return
        }
        markReady({
            variables: {
                matchId: phase.match.id,
                playerId: currentUser.id
            }
        })
    }

    return <Grid container sx={{height: "100%", justifyContent: "center", alignItems: "center"}}>
        <Grid item xs={4} sx={{display: "flex", justifyContent: "center"}}>
            {props.team1Captain &&
                <Box className={classes.captain}>
                    <PlayerPicture player={props.team1Captain} style={{width: "100px"}}/>
                    <Box className={classes.captainSpinner}>
                        {state.teamOneAction.ready ? <Check style={{fontSize: "48px", color: "#39c900"}}/> :
                            <CircularProgress style={{zIndex: 100}}/>}
                    </Box>
                </Box>}
        </Grid>
        <Grid item xs={4} sx={{textAlign: "center"}}>
            <Typography variant={"h2"}>Venter på hold bliver klar</Typography>
            {countdown && countdown > 0 && <Typography variant={"h2"}>{countdownString}</Typography>}
            {(isCurrentUserTeamOneCaptain || isCurrentUserTeamTwoCaptain) &&
                <Button size={"large"} sx={{marginTop: "16px"}} onClick={handleCaptainReady}>Klar</Button>}
        </Grid>
        <Grid item xs={4} sx={{display: "flex", justifyContent: "center"}}>
            {props.team2Captain &&
                <Box className={classes.captain}>
                    <Box className={classes.captainSpinner}>
                        {state.teamTwoAction.ready ? <Check style={{fontSize: "48px", color: "#39c900"}}/> :
                            <CircularProgress style={{zIndex: 100}}/>}
                    </Box>
                    <PlayerPicture player={props.team2Captain} style={{width: "100px"}}/>
                </Box>}
        </Grid>
    </Grid>
}