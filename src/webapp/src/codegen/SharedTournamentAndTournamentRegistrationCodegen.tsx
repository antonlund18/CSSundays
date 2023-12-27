import {gql} from "@apollo/client";


gql`
    mutation registerTeamOrPlayer($tournamentId: Int!, $teamId: Int!, $playerId: Int!) {
        registerTeamOrPlayer(teamId: $teamId, tournamentId: $tournamentId, playerId: $playerId) {
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