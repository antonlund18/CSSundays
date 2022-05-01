import {gql, useMutation} from "@apollo/client";

const CREATE_TEAM = gql`
    mutation createTeam($name: String!, $playerId: Int!) {
        createTeam(name: $name, playerId: $playerId) {
            name
            owner {
                username
            }
            createdTs
        }
    }
`

export const useCreateTeam = () => {
    return useMutation(CREATE_TEAM);
}