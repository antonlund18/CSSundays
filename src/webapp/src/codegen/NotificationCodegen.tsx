import { gql } from "@apollo/client";

gql`
    query getAllNotifications($userId: Int!) {
        getAllNotifications(userId: $userId) {
            id,
            isSeen,
            recipient {
                id,
                playertag,
                picture
            },
            notificationType,
            notifiableObject {
                ... on InviteToTeam {
                    id,
                    recipient {
                        id,
                        playertag,
                        picture
                    },
                    sender {
                        id,
                        playertag,
                        picture
                    },
                    createdTs,
                    team {
                        id,
                        name,
                        picture
                    }
                    status
                }
            },
            createdTs
        }
    }
`

gql`
    mutation markAllNotificationsAsSeenForUser($userId: Int!) {
        markAllNotificationsAsSeenForUser(userId: $userId) {
            id,
            isSeen
        }
    }
`