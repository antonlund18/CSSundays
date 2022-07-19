import {gql} from "@apollo/client";

gql`
    query getAllTeams {
        getAllTeams {
            id
            name
            picture
            wins
            losses
            createdTs
        }
    }
`;

gql`
    query getTeamById($teamId: Int!) {
        getTeamById(teamId: $teamId) {
            id
            name
            owner {
                id,
                playertag,
                picture
            }
            picture
            wins
            losses
            createdTs
            users {
                id,
                playertag,
                picture
            }
        }
    }
`;

gql`
    mutation incrementWins($teamId: Int!) {
        incrementWins(teamId: $teamId) {
            id,
            wins
        }
    }
`;

gql`
    mutation createTeam($name: String!, $ownerId: Int!) {
        createTeam(name: $name, ownerId: $ownerId) {
            id,
            users {
                id
                playertag
                picture
            }
        }
    }
`