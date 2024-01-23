import { gql } from "@apollo/client";


gql`
    query getSearchResults($searchQuery: String!, $searchType: SearchType!) {
        getSearchResults(searchQuery: $searchQuery, searchType: $searchType) {
            ... on User {
                id,
                playertag,
                picture,
                createdTs
            }
            ... on Team {
                id,
                name,
                picture,
                createdTs,
                owner {
                    playertag
                }
                users {
                    id
                }
            }
            ... on Tournament {
                id,
                name,
                picture
                startDateAndTime
                tournamentRegistrations {
                    id
                }
            }
        }
    }
`