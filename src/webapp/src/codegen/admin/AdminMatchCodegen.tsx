import {gql} from "@apollo/client";

gql`
    mutation createTestMatch {
        createTestMatch {
            id
        }
    }
`

gql`
    mutation changeMatchPhase($matchId: Int!, $changeMatchPhaseStrategy: ChangeMatchPhaseStrategy!) {
        changeMatchPhase(matchId: $matchId, changeMatchPhaseStrategy: $changeMatchPhaseStrategy) {
            id,
            currentPhase {
                id
                phaseType
                state {
                    ... on MatchPhaseState {
                        id
                        createdTs
                        endTs
                    }
                    ... on MatchReadyCheckPhaseState {
                        id
                        createdTs
                        endTs
                    }
                }
            }
        }
    }
`