import * as React from "react"
import {useContext, useEffect, useMemo, useState} from "react"
import {Box, Button, IconButton, TextField, Theme, Typography} from "@mui/material";
import {Match, MatchInProgressPhaseState, MatchPhase, User} from "../../../codegen/generated-types";
import {CS2Map, mapPool} from "../../../util/MapPool";
import {makeStyles} from "@mui/styles";
import {ContentCopy} from "@mui/icons-material";
import {SnackbarContext} from "../../../SnackbarContextProvider";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {MatchPhaseStateWithType} from "../MatchPagePhaseContainer";

interface StylesProps {
    mapName: string
    mapPicture: string
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    mapPicture: props => ({
        "&::after": {
            position: "absolute",
            bottom: 0,
            left: 0,
            textAlign: "center",
            width: "100%",
            background: "rgba(0, 0, 0, .4)",
            color: "rgb(241,241,241)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            content: "'" + props.mapName + "'"
        },
        width: "100%",
        aspectRatio: "2/1",
        border: "2px solid white",
        position: "relative",
        backgroundImage: "url(" + props.mapPicture + " )",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        marginTop: "32px"
    }),
}))

const TEST_IP = "127.0.0.1"

type MatchPageInProgressPhaseProps = {
    match: Match
    phase: MatchPhase
}

export const MatchPageInProgressPhase = (props: MatchPageInProgressPhaseProps) => {
    const {phase} = props
    const state = phase.state as MatchInProgressPhaseState
    const [map, setMap] = useState<CS2Map | null>(null)
    const classes = useStyles({mapName: map?.label ?? "", mapPicture: map?.picture ?? ""})
    const {openSnackbar} = useContext(SnackbarContext)
    const {currentUser} = useGetCurrentUser()

    useEffect(() => {
        if (state.map) {
            setMap(mapPool[state.map])
        }
    }, [state.map])

    const isCurrentUserInMatch = useMemo(() => {
        if (!currentUser) {
            return false
        }
        const match = props.match
        const allPlayers: User[] = [...match.tournamentRegistration1?.players ?? [], ...match.tournamentRegistration2?.players ?? []]
        return allPlayers.filter(user => user.id === currentUser.id).length === 1
    }, [currentUser, props.match])

    if (!map) {
        return <></>
    }

    if ((phase.state as MatchPhaseStateWithType).__typename !== "MatchInProgressPhaseState") {
        return <></>
    }

    const handleCopyIp = () => {
        navigator.clipboard.writeText(TEST_IP)
        openSnackbar("IP kopieret til udklipsholderen", "info")
    }

    return <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%"
    }}>
        <div style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            width: "30%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Typography variant={"h2"}>Kamp i gang</Typography>
            <Box className={classes.mapPicture}/>
            <TextField label={"Server IP"} disabled={!isCurrentUserInMatch} value={isCurrentUserInMatch ? TEST_IP : "XXX.XXX.XXX.XXX"} style={{marginTop: "16px", width: "100%"}} InputProps={{
                endAdornment: isCurrentUserInMatch && <IconButton>
                    <ContentCopy onClick={handleCopyIp}/>
                </IconButton>
            }}/>
            <Button variant={"contained"} style={{width: "100%", marginTop: "16px", height: "52px"}} disabled={!isCurrentUserInMatch}>join kamp</Button>
        </div>
    </div>
}
