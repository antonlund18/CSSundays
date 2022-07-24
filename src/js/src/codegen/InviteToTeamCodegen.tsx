import {gql} from "@apollo/client";

gql`
    query findPendingInvitesForPlayer($playerId: Int!) {
        findPendingInvitesForPlayer(playerId: $playerId) {
            id,
            player {
                id,
                playertag,
                picture
            },
            team {
                id,
                name,
                picture,
                owner {
                    id,
                    playertag,
                    picture
                }
            }
            status
        }
    }
`

gql`
    mutation createInviteToTeam($playerId: Int!, $teamId: Int!) {
        createInviteToTeam(playerId: $playerId, teamId: $teamId) {
            id,
            player {
                id,
                playertag,
                picture
            },
            team {
                id,
                name,
                picture,
                owner {
                    id,
                    playertag,
                    picture
                }
            }
            status
        }
    }
`

gql`
    mutation acceptInvitation($id: Int!) {
        acceptInvitation(invitationId: $id) {
            id,
            player {
                id,
                playertag,
                picture
            },
            team {
                id,
                name,
                picture,
                owner {
                    id,
                    playertag,
                    picture
                }
            }
            status
        }
    }
`

gql`
    mutation declineInvitation($id: Int!) {
        declineInvitation(invitationId: $id) {
            id,
            player {
                id,
                playertag,
                picture
            },
            team {
                id,
                name,
                picture,
                owner {
                    id,
                    playertag,
                    picture
                }
            }
            status
        }
    }
`