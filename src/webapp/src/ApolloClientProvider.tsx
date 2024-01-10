import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {Constants} from "./util/Constants";
import {WebSocketLink} from "@apollo/client/link/ws";
import {SubscriptionClient} from "subscriptions-transport-ws";
import {getMainDefinition} from "@apollo/client/utilities";

const DEV_DOMAIN = "localhost:8080"
const PROD_DOMAIN = "backend.cssundays.dk"
const GRAPHQL_ROUTE = "/graphql"
const SUBSCRIPTIONS_ROUTE = "/subscriptions"

const httpLink = createHttpLink({
    uri: process.env.NODE_ENV === "development" ?
        `http://${DEV_DOMAIN + GRAPHQL_ROUTE}` : `https://${PROD_DOMAIN + GRAPHQL_ROUTE}`,
});

const wsLink = new WebSocketLink(
    new SubscriptionClient(
        process.env.NODE_ENV === "development" ?
            `ws://${DEV_DOMAIN + SUBSCRIPTIONS_ROUTE}` : `ws://${PROD_DOMAIN + SUBSCRIPTIONS_ROUTE}`)
);

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(Constants.JWT_TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache()
})

export const ApolloClientProvider = (props: React.PropsWithChildren<any>) => {
    return <ApolloProvider client={client}>
        {props.children}
    </ApolloProvider>
}