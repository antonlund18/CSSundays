import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {Constants} from "./util/Constants";


const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(Constants.JWT_TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export const ApolloClientProvider = (props: React.PropsWithChildren<any>) => {
    return <ApolloProvider client={client}>
        {props.children}
    </ApolloProvider>
}