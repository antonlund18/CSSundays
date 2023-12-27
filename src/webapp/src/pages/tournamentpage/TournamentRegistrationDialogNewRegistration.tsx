import * as React from "react"
import {Tournament, User} from "../../codegen/generated-types";
import {TournamentRegistrationDialogNewRegistrationTeamRow} from "./TournamentRegistrationDialogNewRegistrationTeamRow";

type TournamentRegistrationDialogNewRegistrationProps = {
    tournament: Tournament
    currentUser: User
}

export const TournamentRegistrationDialogNewRegistration = (props: TournamentRegistrationDialogNewRegistrationProps) => {
    return <div style={{padding: "16px"}}>
        {props.currentUser?.teams.map((team, index) => {
            return <TournamentRegistrationDialogNewRegistrationTeamRow
                key={index}
                tournament={props.tournament}
                team={team}
                currentUser={props.currentUser}
                includeDivider={index !== props.currentUser.teams.length - 1}/>
        })}
    </div>
}