import {gql} from "@apollo/client";

gql`
    mutation createTournament($name: String!, $date: String!, $numberOfTeamsAllowed: Int!) {
        createTournament(name: $name, date: $date, numberOfTeamsAllowed: $numberOfTeamsAllowed) {
            id,
            name,
            date,
            numberOfTeamsAllowed
        }
    }
`