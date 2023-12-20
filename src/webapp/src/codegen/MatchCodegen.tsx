import {gql} from "@apollo/client";

gql`
    query getMatchesByParentIds($parentIds: [Int!]!) {
        getMatchesByParentIds(parentIds: $parentIds) {
            id,
            team1 {
                id,
                name,
                picture,
                users {
                    id
                }
            },
            team2 {
                id,
                name,
                picture
                users {
                    id
                }
            }
        }
    }
`

gql`
    query getMatchById($matchId: Int!) {
        getMatchById(matchId: $matchId) {
            id,
            team1 {
                id,
                name,
                picture,
                users {
                    id,
                    playertag,
                    picture
                }
            },
            team2 {
                id,
                name,
                picture
                users {
                    id,
                    playertag,
                    picture
                }
            },
            phase {
                phase,
                state {
                    ... on MatchReadyCheckPhaseState {
                        createdTs,
                        endTs
                    }
                }
            }
        }
    }
`