import * as React from "react"
import {Tournament, User} from "../../../codegen/generated-types";
import {TournamentRegistrationDialogNewRegistrationTeamRow} from "./TournamentRegistrationDialogNewRegistrationTeamRow";
import {useTournaments} from "../../../hooks/api/useTournament";
import {CircularProgress} from "@mui/material";

type TournamentRegistrationDialogNewRegistrationProps = {
    tournament: Tournament
    currentUser: User
}

export const TournamentRegistrationDialogNewRegistration = (props: TournamentRegistrationDialogNewRegistrationProps) => {
    const {registerMutation} = useTournaments()

    if (registerMutation.loading) {
        return <div style={{height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <CircularProgress/>
        </div>
    }

    return <div style={{height: "100%", padding: "16px"}}>
        {props.currentUser.teams.map((team, index) => {
            return <TournamentRegistrationDialogNewRegistrationTeamRow
                key={index}
                registerMutation={registerMutation}
                tournament={props.tournament}
                team={team}
                currentUser={props.currentUser}
                includeDivider={index !== props.currentUser.teams.length - 1}/>
        })}
    </div>
}