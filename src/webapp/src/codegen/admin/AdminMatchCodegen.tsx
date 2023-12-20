import {gql} from "@apollo/client";

gql`
    mutation createTestMatch {
        createTestMatch {
            id
        }
    }
`