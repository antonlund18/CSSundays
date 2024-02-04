import * as React from "react"
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {
    ObjectType,
    Team,
    Tournament,
    useGetTournamentRegistrationByTeamQuery,
    User
} from "../../../codegen/generated-types";
import {Button, Divider, Typography} from "@mui/material";
import {useMemo} from "react";

type TournamentRegistrationDialogNewRegistrationTeamRowProps = {
    tournament: Tournament
    currentUser: User
    registerMutation: { register: (tournamentId: number, teamId: number, userId: number) => void, loading: boolean }
    team: Team
    includeDivider: boolean
}

export const TournamentRegistrationDialogNewRegistrationTeamRow = (props: TournamentRegistrationDialogNewRegistrationTeamRowProps) => {
    const {data} = useGetTournamentRegistrationByTeamQuery({
        variables: {
            tournamentId: props.tournament.id ?? -1,
            teamId: props.team.id ?? -1
        }
    })

    const isRegistered = data?.getTournamentRegistrationByTeam !== null

    const handleRegister = (team: Team) => {
        if (!props.tournament.id || !team.id || !props.currentUser?.id) {
            return
        }
        props.registerMutation.register(props.tournament.id, team.id, props.currentUser.id)
    }

    const teamIsFull = useMemo(() => {
        if (isRegistered && data?.getTournamentRegistrationByTeam?.players.length === 5) {
            const players = data?.getTournamentRegistrationByTeam?.players.filter(player => player.deletedTs === null)
            return players.length === 5
        }
        return false
    }, [data?.getTournamentRegistrationByTeam])

    return <>
        <div
            style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <img src={getPictureLinkFromKey(props.team.picture ?? "", ObjectType.Team)}
                     style={{width: "32px", aspectRatio: "1/1"}}/>
                <div>
                    <Typography variant={"h4"}
                                style={{marginLeft: "16px", textTransform: "none"}}>{props.team.name}</Typography>
                    <Typography variant={"subtitle2"}
                                style={{marginLeft: "16px", textTransform: "none", color: isRegistered ? "green" : "red"}}>{isRegistered ? "Tilmeldt" : "Ikke tilmeldt"}</Typography>
                </div>
            </div>
            <Button onClick={() => handleRegister(props.team)} disabled={teamIsFull}>{teamIsFull ? "Fuld" : "Tilmeld"}</Button>
        </div>
        {props.includeDivider &&
            <Divider sx={{marginTop: "8px", marginBottom: "8px"}}/>}
    </>
}