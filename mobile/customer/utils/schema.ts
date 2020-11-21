import gql from "graphql-tag";

export const graphql = {
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
    signUp: gql`mutation SignIn($input: SignInInput) {
      signIn(input: $input) {
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

export default graphql;
