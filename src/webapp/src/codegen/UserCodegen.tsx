import {gql} from "@apollo/client";

gql`
    query getUserById($id: Int!) {
        getUserById(id: $id) {
            id
            playertag
            email
            role
            description
            picture
            createdTs
            teams {
                id
                name
                picture
                users {
                    playertag
                }
            },
            steamId
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
    mutation createUser($playertag: String!, $email: String!, $password: String!, $passwordRepeated: String!) {
        createUser(playertag: $playertag, email: $email, password: $password, passwordRepeated: $passwordRepeated)
    }
`

gql`
    mutation loginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password)
    }
`

gql`
    mutation updateUser($editUserInput: EditUserInput!) {
        updateUser(editUserInput: $editUserInput) {
            id
            email
            description
        }
    }
`

gql`
    mutation changePassword($userId: Int!, $currentPassword: String!, $newPassword: String!, $newPasswordRepeated: String!) {
        changePassword(userId: $userId, currentPassword: $currentPassword, newPassword: $newPassword, newPasswordRepeated: $newPasswordRepeated) {
            id
        }
    }
`

gql`
    mutation setSteamId($userId: Int!, $steamId: String!) {
        setSteamId(userId: $userId, steamId: $steamId) {
            id,
            steamId
        }
    }
`
