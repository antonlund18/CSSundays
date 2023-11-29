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