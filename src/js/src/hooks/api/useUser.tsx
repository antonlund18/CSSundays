import {gql, useMutation, useQuery} from "@apollo/client";
import {Team} from "./useTeam";
import {Constants} from "../../util/Constants";

const GET_USER_BY_ID = gql`
    query getUserById($id: Int!) {
        getUserById(id: $id) {
            id
            playertag
            email
            role
            picture
            teams {
                name
                users {
                    playertag
                }
            }
        }
    }
`

const GET_CURRENT_USER = gql`
    query getCurrentUser($token: String!) {
        getCurrentUser(token: $token) {
            id
            playertag
            email
            role
            picture
            teams {
                name
                users {
                    playertag
                }
            }
        }
    }
`

const CREATE_USER = gql`
    mutation createUser($playertag: String!, $email: String!, $password: String!) {
        createUser(playertag: $playertag, email: $email, password: $password)
    }
`

const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password)
    }
`

export const useGetUserById = (id: number) => {
    return useQuery(GET_USER_BY_ID, {
        variables: {
            id: id
        }
    });
}

export const useGetCurrentUser = (): {currentUser: User | undefined, isLoggedIn: boolean} => {
    const token = localStorage.getItem(Constants.JWT_TOKEN);
    const {data} = useQuery<GetCurrentUserResponse, GetCurrentUserVariables>(GET_CURRENT_USER, {
        variables: {
            token: token ?? ""
        }
    })
    const isLoggedIn = data !== null;
    return {
        currentUser: data?.getCurrentUser,
        isLoggedIn
    }
}

export const useMutateUser = () => {
    const [createUserMutation] = useMutation<CreateUserResponse, CreateUserVariables>(CREATE_USER);
    const [loginUserMutation] = useMutation<LogInUserResponse, LogInUserVariables>(LOGIN_USER);

    const createUser = (playertag: string, email: string, password: string) => {
        return createUserMutation({
            variables: {
                playertag: playertag,
                email: email,
                password: password
            }
        }).then((data) => {
            localStorage.setItem(Constants.JWT_TOKEN, data.data?.createUser ?? "");
        })
    }


    const loginUser = (email: string, password: string) => {
        return loginUserMutation({
            variables: {
                email: email,
                password: password
            }
        }).then((data) => {
            localStorage.setItem(Constants.JWT_TOKEN, data.data?.loginUser ?? "");
        })
    }

    const logOutUser = () => {
        localStorage.removeItem(Constants.JWT_TOKEN);
    }

    return {
        createUser,
        loginUser,
        logOutUser,
    }
}

export interface User {
    readonly id: number
    readonly playertag: string,
    readonly email: string,
    readonly role: number,
    readonly picture: string,
    readonly createdTs: string,
    readonly teams: Team[] | null,
}

type CreateUserVariables = {
    readonly playertag: string,
    readonly email: string,
    readonly password: string
}

type CreateUserResponse = {
    readonly createUser: string
}

type LogInUserVariables = {
    readonly email: string,
    readonly password: string
}

type LogInUserResponse = {
    readonly loginUser: string
}

type GetCurrentUserResponse = {
    readonly getCurrentUser: User
}

type GetCurrentUserVariables = {
    readonly token: string
}