import { gql } from "@apollo/client";

gql`
    mutation createTestData {
        createTestData {
            id
        }
    }
`