import {gql, useMutation} from "@apollo/client";
import {Player} from "./usePlayer";

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

export interface Team {
    readonly name: string,
    readonly picture: string,
    readonly owner: Player,
    readonly players: Player[],
    readonly createdTs: string,
}