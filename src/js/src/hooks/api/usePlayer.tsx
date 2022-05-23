import {gql, useMutation, useQuery} from "@apollo/client";
import {Team} from "./useTeam";

const GET_PLAYER_BY_ID = gql`
    query getPlayerById($id: Int!) {
        getPlayerById(id: $id) {
            id
            username
            email
            picture
            teams {
                name
                players {
                    username
                }            
            }
        }
    }
`

const CREATE_PLAYER = gql`
    mutation createPlayer($username: String!, $email: String!, $userId: String!) {
        createPlayer(username: $username, email: $email, userId: $userId) {
            username
            email
            userId
            createdTs
            teams {
                name
            }
        }
    }
`

export const usePlayer = (id: number) => {
    return useQuery(GET_PLAYER_BY_ID, {
        variables: {
            id: id
        }
    });
}

export const useMutatePlayer = () => {
    const [createPlayerMutation] = useMutation<CreatePlayerResponse, CreatePlayerVariables>(CREATE_PLAYER);

    const createPlayer = (username: string, email: string, userId: string) => {
        console.log(username, email, userId)
        return createPlayerMutation({
            variables: {
                username: username,
                email: email,
                userId: userId,
            }
        })
    }

    return {createPlayer}
}

export interface Player {
    readonly username: string,
    readonly email: string,
    readonly picture: string,
    readonly userId: string,
    readonly createdTs: string,
    readonly teams: Team[] | null,
}

type CreatePlayerVariables = {
    readonly username: string,
    readonly email: string,
    readonly userId: string,
}

type CreatePlayerResponse = {
    readonly player: Player
}