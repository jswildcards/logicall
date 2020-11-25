import gql from "graphql-tag";

export const graphql = {
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

export default graphql;
