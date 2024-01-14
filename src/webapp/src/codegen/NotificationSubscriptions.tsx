import {gql} from "@apollo/client";


gql`
    subscription onNewNotification($userId: Int) {
        onNewNotification(userId: $userId) {
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