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
            chatMessages {
                sender {
                    id
                    playertag
                }
                message
            }
            currentPhase {
                id,
                phaseType,
                createdTs,
                endTs,
                match {
                    id
                }
                state {
                    __typename
                    ... on MatchReadyCheckPhaseState {
                        id
                        teamOneAction {
                            ready
                        }
                        teamTwoAction {
                            ready
                        }
                    }
                    ... on MatchPickAndBanPhaseState {
                        id,
                        firstTeamToBan
                        votingTimeInSeconds
                        actions {
                            id
                            captain {
                                id
                            }
                            ban
                        }
                    }
                    ... on MatchInProgressPhaseState {
                        id,
                        map
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
                    __typename
                    ... on MatchReadyCheckPhaseState {
                        id
                        teamOneAction {
                            ready
                        }
                        teamTwoAction {
                            ready
                        }
                    },
                    ... on MatchPickAndBanPhaseState {
                        id,
                        firstTeamToBan
                        votingTimeInSeconds
                        actions {
                            id
                            captain {
                                id
                            }
                            ban
                        }
                    }
                }
            }
        }
    }
`

gql`
    mutation banMap($matchId: Int!, $playerId: Int!, $ban: CSMap!) {
        banMap(matchId: $matchId, playerId: $playerId, ban: $ban) {
            id,
            currentPhase {
                id,
                endTs,
                state {
                    __typename
                    ... on MatchPickAndBanPhaseState {
                        id,
                        firstTeamToBan
                        votingTimeInSeconds
                        actions {
                            id
                            captain {
                                id
                            }
                            ban
                        }
                    }
                    ... on MatchInProgressPhaseState {
                        id,
                        map
                    }
                }
            }
        }
    }
`

gql`
    mutation sendChatMessage($matchId: Int!, $senderId: Int!, $message: String!) {
        sendChatMessage(matchId: $matchId, senderId: $senderId, message: $message) {
            id
        }
    }
`