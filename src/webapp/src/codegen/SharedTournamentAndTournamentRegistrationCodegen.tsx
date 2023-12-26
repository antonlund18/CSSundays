import {gql} from "@apollo/client";


gql`
    mutation registerTeam($tournamentId: Int!, $teamId: Int!, $captainId: Int!) {
        registerTeam(teamId: $teamId, tournamentId: $tournamentId, captainId: $captainId) {
            id,
            teamRegistrations {
                id,
                captain {
                    id,
                    playertag,
                    picture
                }
                team {
                    id,
                    name,
                }
            }
        }
    }
`