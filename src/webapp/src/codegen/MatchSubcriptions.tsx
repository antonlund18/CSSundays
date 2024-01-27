import {gql} from "@apollo/client";

gql`
    subscription onMatchPhaseChanged($matchId: Int!) {
        onMatchPhaseChanged(matchId: $matchId) {
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
                ... on MatchFinishedPhaseState {
                    id,
                    winTeamOne
                }
            }
        }
    }
`

gql`
    subscription onNewMatchChatMessage($matchId: Int!) {
        onNewMatchChatMessage(matchId: $matchId) {
            id
            sender {
                id
                playertag
            }
            message
            createdTs
        }
    }
`