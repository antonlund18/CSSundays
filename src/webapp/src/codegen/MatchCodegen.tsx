import {gql} from "@apollo/client";

gql`
    query getMatchesByParentIds($parentIds: [Int!]!) {
        getMatchesByParentIds(parentIds: $parentIds) {
            id,
            team1 {
                id,
                name
            },
            team2 {
                id,
                name
            }
        }
    }
`