import {gql} from "@apollo/client";

gql`
  subscription flow {
      flow
  }
`

gql`
    subscription counter($limit: Int) {
        counter(limit: $limit) {
            number
        }
    }
`