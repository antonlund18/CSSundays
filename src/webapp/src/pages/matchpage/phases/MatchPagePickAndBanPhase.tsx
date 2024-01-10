import * as React from "react"
import {useEffect, useState} from "react"
import {Box, Button, CircularProgress, Theme, Typography} from "@mui/material";
import {PlayerPicture} from "../../teamspage/team/PlayerPicture";
import {activeDutyMapPool} from "../../../util/MapPool";
import {makeStyles} from "@mui/styles";
import {
    CsMap,
    Match, MatchPhase,
    MatchPickAndBanPhaseState,
    TournamentRegistration,
    useBanMapMutation,
    User
} from "../../../codegen/generated-types";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {MatchPhaseStateWithType} from "../MatchPagePhaseContainer";

interface StylesProps {
    isVoting: boolean
}

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
    mapButton: props => ({
        "&:hover": {
            transform: props.isVoting ? "scale(1.2)" : "none"
        },
        "&.MuiButtonBase-root:disabled": {
            boxShadow: "inset 0 0 0 1000px rgba(0,0,0,.8)",
            color: "rgba(255, 255, 255, 0.2)"
        },
        cursor: props.isVoting ? "pointer" : "default",
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
    }),
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
    match: Match
    phase: MatchPhase
    team1Captain: User | undefined
    team2Captain: User | undefined
}

export const MatchPagePickAndBanPhase = (props: MatchPageMapPickPhaseProps) => {
    const {currentUser} = useGetCurrentUser()
    const [banMap] = useBanMapMutation()

    const [countdown, setCountdown] = useState<number | null>(null);
    const countdownInSeconds = countdown ? parseInt(String(countdown % 60)) : 0

    const phase = props.phase
    const state = phase.state as MatchPickAndBanPhaseState
    const bannedMaps = state.actions?.map(action => action.ban)

    const tournamentRegistration1 = props.match.tournamentRegistration1
    const tournamentRegistration2 = props.match.tournamentRegistration2

    const isTeamOneToBan = (state.firstTeamToBan + state.actions?.length) % 2 == 1
    const currentCaptainToVote = isTeamOneToBan ? tournamentRegistration1?.captain : tournamentRegistration2?.captain
    const isCurrentUserVoting = currentCaptainToVote?.id === currentUser?.id

    const classes = useStyles({isVoting: isCurrentUserVoting})

    const isPlayerCaptainForTournamentRegistration = (tournamentRegistration?: TournamentRegistration, player?: User) => {
        if (!tournamentRegistration?.captain.id || !player?.id) {
            return false
        }
        return tournamentRegistration.captain.id === player.id
    }

    const isCurrentCaptainToVoteCaptainForTeamOne = isPlayerCaptainForTournamentRegistration(tournamentRegistration1, currentCaptainToVote)

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

    const handleMapBan = (map: CsMap) => {
        if (!props.match?.id || !currentUser?.id) {
            return
        }
        banMap({
            variables: {
                matchId: props.match.id,
                playerId: currentUser.id,
                ban: map
            }
        })
    }

    if ((phase.state as MatchPhaseStateWithType).__typename !== "MatchPickAndBanPhaseState") {
        return <></>
    }

    return <>
        <div className={classes.captainAndCountdownContainer}>
            <div className={classes.captainContainer}>
                {isTeamOneToBan &&
                    <Box className={classes.captainSpinner}>
                        <CircularProgress style={{zIndex: 100}}/>
                        {props.team1Captain &&
                            <Box className={classes.captain}>
                                <PlayerPicture player={props.team1Captain} style={{width: "150%", padding: 0}}/>
                            </Box>}
                    </Box>}
            </div>
            <div style={{display: "flex", justifyContent: "center", width: "33%"}}>
                <Typography variant={"h4"} style={{textTransform: "none"}}>
                    <Typography variant={"h4"} style={{display: "inline", textTransform: "none"}} color={isCurrentCaptainToVoteCaptainForTeamOne ? "primary" : "error"}>
                        {currentCaptainToVote?.playertag}
                    </Typography>
                    {` TIL AT BANNE (${countdownInSeconds}s)`}
                </Typography>
            </div>
            <div className={classes.captainContainer}>
                {!isTeamOneToBan &&
                    <Box className={classes.captainSpinner}>
                        <CircularProgress style={{zIndex: 100}}/>
                        {props.team2Captain &&
                            <Box className={classes.captain}>
                                <PlayerPicture player={props.team2Captain} style={{width: "150%", padding: 0}}/>
                            </Box>}
                    </Box>}
            </div>
        </div>
        <div style={{flex: 1, overflow: "hidden"}}>
            <div style={{height: "100%", display: "flex"}}>
                {activeDutyMapPool.map(map => {
                    return <Button
                        className={classes.mapButton}
                        onClick={() => handleMapBan(map.map)}
                        disabled={bannedMaps.includes(map.map)}
                        style={{backgroundImage: `url(${map.picture})`}}>
                        <Typography variant={"h2"}>{map.label}</Typography>
                    </Button>
                })}
            </div>
        </div>
    </>
}