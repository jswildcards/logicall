import React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloLink, split } from "apollo-boost";

const wsLink = process.browser
  ? new WebSocketLink(
      new SubscriptionClient(`ws://${process.env.NEXT_PUBLIC_SERVER_HOST}/api`, {
        reconnect: true,
      })
    )
  : null;

const httpLink = createHttpLink({ uri: "/api", credentials: "include" });

const link = wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

const cache = new InMemoryCache()

export const client = new ApolloClient({
  link: ApolloLink.from([link]),
  cache,
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
