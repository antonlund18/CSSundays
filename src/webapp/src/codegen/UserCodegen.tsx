import {gql} from "@apollo/client";

gql`
    query getUserById($id: Int!) {
        getUserById(id: $id) {
            id
            playertag
            email
            role
            picture
            createdTs
            teams {
                id
                name
                picture
                users {
                    playertag
                }
            }
        }
    }
`

gql`
    query getCurrentUser($token: String!) {
        getCurrentUser(token: $token) {
            id
            playertag
            email
            role
            picture
            teams {
                id
                name
                picture
                users {
                    playertag
                }
            }
        }
    }
`

gql`
    mutation createUser($playertag: String!, $email: String!, $password: String!) {
        createUser(playertag: $playertag, email: $email, password: $password)
    }
`

gql`
    mutation loginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password)
    }
`