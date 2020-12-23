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
    orders: gql `{
      orders {
        orderId
        sender {
          userId
          username
          firstName
          lastName
        }
        receiver {
          userId
          username
          firstName
          lastName
        }
        senderAddress {
          addressId
          address
          district
          latitude
          longitude
        }
        receiverAddress {
          addressId
          address
          district
          latitude
          longitude
        }
        status
        comments
      }
    }`
  },
  mutation: {
    updateOrderStatus: gql`mutation($orderId: String, $status: String) {
      updateOrderStatus(orderId: $orderId, status: $status) {
        orderId
        sender {
          userId
          username
          firstName
          lastName
        }
        receiver {
          userId
          username
          firstName
          lastName
        }
        senderAddress {
          addressId
          address
          district
          latitude
          longitude
        }
        receiverAddress {
          addressId
          address
          district
          latitude
          longitude
        }
        status
        comments
      }
    }`,
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
