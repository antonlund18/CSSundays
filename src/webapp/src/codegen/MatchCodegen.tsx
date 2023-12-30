import {gql} from "@apollo/client";

gql`
    query getMatchesByParentIds($parentIds: [Int!]!) {
        getMatchesByParentIds(parentIds: $parentIds) {
            id,
            tournamentRegistration1 {
                team {
                    id,
                    name,
                    picture
                },
                players {
                    id,
                    playertag,
                    picture,
                }
            },
            tournamentRegistration2 {
                team {
                    id,
                    name,
                    picture
                }
                players {
                    id,
                    playertag,
                    picture,
                }
            }
        }
    }
`

gql`
    query getMatchById($matchId: Int!) {
        getMatchById(matchId: $matchId) {
            id,
            tournamentRegistration1 {
                team {
                    id,
                    name,
                    picture,
                }
                players {
                    id,
                    playertag,
                    picture,
                }
            },
            tournamentRegistration2 {
                team {
                    id,
                    name,
                    picture
                },
                players {
                    id,
                    playertag,
                    picture,
                }
            },
            currentPhase {
                phaseType,
                createdTs,
                endTs,
                state {
                    ... on MatchReadyCheckPhaseState {
                        id
                    }
                }
            }
        }
    }
`