import React from "react";
import "fontsource-roboto";

import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { ChakraProvider } from "@chakra-ui/react"

const httpLink = createHttpLink(
  { uri: "/api" }
);

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});


function MyApp({ Component, pageProps }) {
  return (
    <div>
      <ApolloProvider client={client}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </ApolloProvider>
    </div>
  );
}

export default MyApp;
