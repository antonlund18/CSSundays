import {gql} from "@apollo/client";

gql`
    query findAllInvitesForPlayer($playerId: Int!) {
        findAllInvitesForPlayer(playerId: $playerId) {
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
            status,
            sender {
                id,
                playertag,
                picture
            },
            seen,
            createdTs
        }
    }
`

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
            seen
        }
    }
`

gql`
    query findAllUnseenInvitesForPlayer($playerId: Int!) {
        findAllUnseenInvitesForPlayer(playerId: $playerId) {
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
            seen,
            createdTs
        }
    }
`

gql`
    mutation createInviteToTeam($playerId: Int!, $teamId: Int!, $senderId: Int!) {
        createInviteToTeam(playerId: $playerId, teamId: $teamId, senderId: $senderId) {
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
            status,
            sender {
                id,
                playertag,
                picture
            },
            seen,
            createdTs
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
            status,
            sender {
                id,
                playertag,
                picture
            },
            seen
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
            status,
            sender {
                id,
                playertag,
                picture
            },
            seen
        }
    }
`

gql`
    mutation markInvitationsAsSeen($playerId: Int!) {
        markInvitationsAsSeen(playerId: $playerId) {
            id,
            seen
        }
    }
`