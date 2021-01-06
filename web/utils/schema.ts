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
        phone
        username
      }
    }`,
    users: gql`query($search: String!) {
      users(search: $search) {
        userId
        firstName
        lastName
        email
        phone
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
          email
          phone
        }
        receiver {
          userId
          username
          firstName
          lastName
          email
          phone
        }
        sendAddress
        sendLatLng
        receiveAddress
        receiveLatLng
        status
        comments
      }
    }`
  },
  mutation: {
    updateOrderStatus: gql`mutation($input: UpdateOrderStatusInput) {
      updateOrderStatus(input: $input) {
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
        driver {
          userId
          username
          firstName
          lastName
        }
        sendAddress
        sendLatLng
        receiveAddress
        receiveLatLng
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
