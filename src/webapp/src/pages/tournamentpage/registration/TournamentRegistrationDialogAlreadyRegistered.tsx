import * as React from "react"
import {
    GetTournamentRegistrationByPlayerDocument, GetTournamentRegistrationByTeamDocument,
    ObjectType,
    TournamentRegistration,
    useDeregisterPlayerFromTournamentMutation,
    useDeregisterTeamFromTournamentMutation,
    User
} from "../../../codegen/generated-types";
import {CheckCircle} from "@mui/icons-material";
import {Button, Typography} from "@mui/material";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {PlayerPicture} from "../../teamspage/team/PlayerPicture";

type TournamentRegistrationDialogAlreadyRegisteredProps = {
    tournamentRegistration: TournamentRegistration
    currentUser: User
}

export const TournamentRegistrationDialogAlreadyRegistered = (props: TournamentRegistrationDialogAlreadyRegisteredProps) => {
    const [deregisterPlayer] = useDeregisterPlayerFromTournamentMutation()
    const [deregisterTeam] = useDeregisterTeamFromTournamentMutation()

    const handleDeregister = () => {
        const isCaptain = props.tournamentRegistration.captain?.id === props.currentUser.id
        if (!props.tournamentRegistration?.tournament?.id) {
            return
        }

        if (isCaptain && props.tournamentRegistration.team.id) {
            deregisterTeam({
                variables: {
                    tournamentId: props.tournamentRegistration.tournament.id,
                    teamId: props.tournamentRegistration.team.id
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
                    tournamentId: props.tournamentRegistration.tournament.id,
                    playerId: props.currentUser.id
                },
                refetchQueries: [
                    GetTournamentRegistrationByPlayerDocument
                ]
            })
        }
    }

    const team = props.tournamentRegistration.team
    const registeredPlayers = props.tournamentRegistration.players
    const renderedPlayers = registeredPlayers.concat(new Array(5 - registeredPlayers.length).fill(null))

    return <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    }}>
        <CheckCircle style={{fontSize: "100px", color: "green"}}/>
        <Typography variant={"h4"}>Du er tilmeldt</Typography>
        <div style={{display: "flex", alignItems: "center", marginTop: "16px"}}>
            <img src={getPictureLinkFromKey(team.picture ?? "", ObjectType.Team)}
                 style={{width: "80px", aspectRatio: "1/1"}}/>
            <Typography variant={"h1"} style={{marginLeft: "16px"}}>{team.name}</Typography>
        </div>
        <div style={{display: "flex"}}>
        {renderedPlayers.map(player => {
            return player ?
                <PlayerPicture player={player} style={{width: "80px"}}/> :
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