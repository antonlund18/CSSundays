import {gql} from "@apollo/client";


gql`
    mutation registerTeam($tournamentId: Int!, $teamId: Int!) {
        registerTeam(teamId: $teamId, tournamentId: $tournamentId) {
            id,
            teamRegistrations {
                id,
                team {
                    id,
                    name
                }
            }
        }
    }
`