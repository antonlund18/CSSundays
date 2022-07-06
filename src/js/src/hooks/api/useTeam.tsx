import {gql, useMutation} from "@apollo/client";
import {User} from "./useUser";

const CREATE_TEAM = gql`
    mutation createTeam($name: String!, $userId: Int!) {
        createTeam(name: $name, userId: $userId) {
            name
            owner {
                playertag
            }
            createdTs
        }
    }
`

export const useCreateTeam = () => {
    return useMutation(CREATE_TEAM);
}

export interface Team {
    readonly name: string,
    readonly picture: string,
    readonly owner: User,
    readonly players: User[],
    readonly createdTs: string,
}