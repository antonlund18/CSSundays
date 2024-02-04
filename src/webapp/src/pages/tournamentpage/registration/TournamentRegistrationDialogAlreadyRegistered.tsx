import * as React from "react"
import {
    GetTournamentRegistrationByPlayerDocument,
    GetTournamentRegistrationByTeamDocument,
    ObjectType,
    TournamentRegistration,
    useDeregisterPlayerFromTournamentMutation,
    useDeregisterTeamFromTournamentMutation,
    User
} from "../../../codegen/generated-types";
import {CheckCircle, Error} from "@mui/icons-material";
import {Button, CircularProgress, Typography} from "@mui/material";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {PlayerPicture} from "../../teamspage/team/PlayerPicture";
import {useMemo} from "react";

type TournamentRegistrationDialogAlreadyRegisteredProps = {
    tournamentRegistration: TournamentRegistration
    currentUser: User
}

export const TournamentRegistrationDialogAlreadyRegistered = (props: TournamentRegistrationDialogAlreadyRegisteredProps) => {
    const [deregisterPlayer] = useDeregisterPlayerFromTournamentMutation()
    const [deregisterTeam, {loading}] = useDeregisterTeamFromTournamentMutation()

    const handleDeregister = () => {
        const isCaptain = props.tournamentRegistration.captain?.id === props.currentUser.id
        if (!props.tournamentRegistration?.tournament?.id) {
            return
        }

        if (isCaptain && props.tournamentRegistration.team.id) {
            deregisterTeam({
                    variables: {
                        tournamentRegistrationId: props.tournamentRegistration.id ?? -1,
                    },
                    refetchQueries: [
                        GetTournamentRegistrationByPlayerDocument,
                        GetTournamentRegistrationByTeamDocument
                    ]
                },
            )
        }

        if (!isCaptain && props.currentUser.id) {
            deregisterPlayer({
                variables: {
                    tournamentRegistrationId: props.tournamentRegistration.id ?? -1,
                    playerId: props.currentUser.id
                },
                refetchQueries: [
                    GetTournamentRegistrationByPlayerDocument
                ]
            })
        }
    }

    const team = props.tournamentRegistration.team
    const registeredPlayers = props.tournamentRegistration.players.filter(player => player.deletedTs === null)
    const renderedPlayers = registeredPlayers.filter(user => user.deletedTs === null).concat(new Array(5 - registeredPlayers.length).fill(null))

    const validationFailed = useMemo(() => {
        return registeredPlayers.filter(player => player.steamId).length !== 5
    }, [registeredPlayers])

    if (loading) {
        return <div
            style={{height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <CircularProgress/>
        </div>
    }


    return <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    }}>
        {!validationFailed ? <CheckCircle style={{fontSize: "100px", color: "green"}}/> :
            <>
                <Error style={{fontSize: "100px", color: "#ffae37"}}/>
                <div style={{width: "80%", textAlign: "center"}}>
                    <Typography>Dit hold er tilmeldt, men i er enten ikke nok spillere, eller nogle spillere mangler at
                        verificere med Steam</Typography>
                </div>
            </>
        }
        <div style={{display: "flex", alignItems: "center", marginTop: "16px"}}>
            <img src={getPictureLinkFromKey(team.picture ?? "", ObjectType.Team)}
                 style={{width: "80px", aspectRatio: "1/1"}}/>
            <Typography variant={"h1"} style={{marginLeft: "16px"}}>{team.name}</Typography>
        </div>
        <div style={{display: "flex", marginTop: "16px"}}>
            {renderedPlayers.map(player => {
                return player ?
                    <PlayerPicture player={player} showSteamVerification style={{width: "80px"}}/> :
                    <div style={{width: "80px", padding: "8px"}}>
                        <img
                            src={"https://static.vecteezy.com/system/resources/previews/007/126/739/non_2x/question-mark-icon-free-vector.jpg"}
                            style={{width: "100%", aspectRatio: "1/1", border: "1px solid black"}}
                        />
                    </div>
            })}
        </div>
        <Button onClick={handleDeregister} variant={"outlined"} sx={{marginTop: "16px"}}>Afmeld</Button>
    </div>
}