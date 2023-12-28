import {gql} from "@apollo/client";

gql`
    query getMatchesByParentIds($parentIds: [Int!]!) {
        getMatchesByParentIds(parentIds: $parentIds) {
            id,
            tournamentRegistration1 {
                team {
                    id,
                    name,
                    picture,
                    users {
                        id
                    }
                }
            },
            tournamentRegistration2 {
                team {
                    id,
                    name,
                    picture
                    users {
                        id
                    }
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
                    users {
                        id,
                        playertag,
                        picture
                    }
                }
            },
            tournamentRegistration2 {
                team {
                    id,
                    name,
                    picture
                    users {
                        id,
                        playertag,
                        picture
                    }
                },
            },
            currentPhase {
                phaseType,
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