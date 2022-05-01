import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";


const client = new ApolloClient({
    uri: "http://localhost:8080/graphql",
    cache: new InMemoryCache()
})

export const ApolloClientProvider = (props: React.PropsWithChildren<any>) => {
    return <ApolloProvider client={client}>
        {props.children}
    </ApolloProvider>
}