import {gql, useMutation, useQuery} from "@apollo/client";

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
            teams            
        }
    }
`

export const usePlayer = (id: number) => {
    const getPlayerById = useQuery(GET_PLAYER_BY_ID, {
        variables: {
            id: id
        }
    });
    return {getPlayerById};
}

export const useCreatePlayer = () => {
    return useMutation(CREATE_PLAYER)
}