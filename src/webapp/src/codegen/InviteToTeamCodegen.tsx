import {gql} from "@apollo/client";



gql`
    query findAllInvitesForPlayer($playerId: Int!) {
        findAllInvitesForPlayer(playerId: $playerId) {
            id,
            recipient {
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
            status,
            sender {
                id,
                playertag,
                picture
            },
            createdTs
        }
    }
`

gql`
    query findPendingInvitesForPlayer($playerId: Int!) {
        findPendingInvitesForPlayer(playerId: $playerId) {
            id,
            recipient {
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
                },
                users {
                    id
                }
            }
            status,
            sender {
                id,
                playertag,
                picture
            },
        }
    }
`

gql`
    mutation acceptInvitation($id: Int!) {
        acceptInvitation(invitationId: $id) {
            id,
            recipient {
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
            status,
            sender {
                id,
                playertag,
                picture
            },
        }
    }
`

gql`
    mutation declineInvitation($id: Int!) {
        declineInvitation(invitationId: $id) {
            id,
            recipient {
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
            status,
            sender {
                id,
                playertag,
                picture
            },
        }
    }
`

gql`
    mutation createInviteToTeam($recipientId: Int!, $teamId: Int!, $senderId: Int!) {
        createInviteToTeam(recipientId: $recipientId, teamId: $teamId, senderId: $senderId) {
            id,
            status,
            recipient {
                id
            }
        }
    }
`;