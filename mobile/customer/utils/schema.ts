import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import Constants from "expo-constants";

const httpLink = createHttpLink(
  { uri: `${Constants.manifest.extra.host}/graphql` },
  // { uri, credentials: 'include' }
);

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const schema = {
  query: {
    me: gql`{
      me {
        userId
        firstName
        lastName
        email
        role
        username
        followers {
          follower {
            userId
            firstName
            lastName
            email
            role
            username
          }
        }
        followees {
          followee {
            userId
            firstName
            lastName
            email
            role
            username
          }
        }
      }
    }`,
    users: gql`query($search: String!) {
      users(search: $search) {
        userId
        firstName
        lastName
        email
        role
        username
      }
    }`,
  },
  mutation: {
    signIn: gql`mutation($input: SignInInput) {
      signIn(input: $input) {
        userId
        firstName
        lastName
        email
        role
        username
      }
    }`,
    signUp: gql`mutation($input: SignUpInput) {
      signUp(input: $input) {
        userId
        firstName
        lastName
        email
        role
        username
      }
    }`,
    signOut: gql`mutation {
      signOut
    }`,
  },
};

export default schema;
