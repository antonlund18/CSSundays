import {gql} from "@apollo/client";

gql`
    mutation setPictureAndGetPresignedRequest($id: Int!, $objectType: ObjectType!) {
        setPictureAndGetPresignedRequest(id: $id, objectType: $objectType) {
            url
            headers {
                name
                value
            }
            method
        }
    }
`