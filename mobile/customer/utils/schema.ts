import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import Constants from "expo-constants";

const httpLink = createHttpLink(
  { uri: `http://${Constants.manifest.extra.host || "192.168.56.1"}/graphql` },
  // { uri, credentials: 'include' }
);

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const schema = {
  query: {
    me: gql`query {
      me {
        userId
        firstName
        lastName
        email
        role
        username
        receiveOrders {
          orderId
        }
        sendOrders {
          orderId
        }
      }
    }`,
  },
  mutation: {
    signIn: gql`mutation SignIn($input: SignInInput) {
      signIn(input: $input) {
        userId
        firstName
        lastName
        email
        role
        username
      }
    }`,
    signUp: gql`mutation SignUp($input: SignUpInput) {
      signUp(input: $input) {
        userId
        firstName
        lastName
        email
        role
        username
      }
    }`,
    signOut: gql`mutation SignOut {
      signOut
    }`,
  },
};

export default schema;
