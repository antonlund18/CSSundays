import {gql} from "@apollo/client";


gql`
    mutation registerTeamOrPlayer($tournamentId: Int!, $teamId: Int!, $playerId: Int!) {
        registerTeamOrPlayer(teamId: $teamId, tournamentId: $tournamentId, playerId: $playerId) {
            id,
            tournamentRegistrations {
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

gql`
    mutation deregisterTeamFromTournament($tournamentRegistrationId: Int!) {
        deregisterTeamFromTournament(tournamentRegistrationId: $tournamentRegistrationId) {
            id
            team {
                id
                name
                picture
            }
            players {
                id
                playertag
                picture
            }
        }
    }
`

gql`
    mutation deregisterPlayerFromTournament($tournamentRegistrationId: Int!, $playerId: Int!) {
        deregisterPlayerFromTournament(tournamentRegistrationId: $tournamentRegistrationId, playerId: $playerId) {
            id
            team {
                id
                name
                picture
            }
            players {
                id
                playertag
                picture
            }
        }
    }
`