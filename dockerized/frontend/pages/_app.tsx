// import '../styles/globals.css'
import React from "react";
import "fontsource-roboto";

// GraphQL
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import Head from "next/head";

// const uri = "http://localhost:4000";

// Redux: add reducers
// import { Provider } from "react-redux";
// import { createStore } from "redux";
// import rootReducers from "../reducers";

const httpLink = createHttpLink(
  { uri: `${process.env.SERVER_HOST ?? ""}/graphql` }
  // { uri, credentials: 'include' }
);

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// const store = createStore(rootReducers);

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <style jsx global>
        {`
          body {
            margin: 0;
          }
        `}
      </style>
      <Head>
        <title>LogiCall</title>
      </Head>
      <ApolloProvider client={client}>
        {/* <Provider store={store}> */}
        <Component {...pageProps} />
        {/* </Provider> */}
      </ApolloProvider>
    </div>
  );
}

export default MyApp;
