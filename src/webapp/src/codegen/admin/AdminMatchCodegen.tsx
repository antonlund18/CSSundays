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
                createdTs
                endTs
                state {
                    ... on MatchPhaseState {
                        id
                    }
                    ... on MatchReadyCheckPhaseState {
                        id
                    }
                }
            }
        }
    }
`