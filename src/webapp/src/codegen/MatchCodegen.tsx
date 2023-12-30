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
                captain {
                    id
                    playertag
                    picture
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
                captain {
                    id
                    playertag
                    picture
                }
            },
            currentPhase {
                id,
                phaseType,
                createdTs,
                endTs,
                match {
                    id
                }
                state {
                    ... on MatchReadyCheckPhaseState {
                        id
                        teamOneAction {
                            ready
                        }
                        teamTwoAction {
                            ready
                        }
                    }
                }
            }
        }
    }
`

gql`
    mutation markReady($matchId: Int!, $playerId: Int!) {
        markReady(matchId: $matchId, playerId: $playerId) {
            id,
            currentPhase {
                id,
                phaseType,
                createdTs,
                endTs,
                state {
                    ... on MatchReadyCheckPhaseState {
                        id
                        teamOneAction {
                            ready
                        }
                        teamTwoAction {
                            ready
                        }
                    }
                }
            }
        }
    }
`