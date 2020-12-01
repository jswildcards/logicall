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
    coordinates: gql`query($query: String, $county: String) {
      coordinates(query: $query, county: $county){
        latitude 
        longitude
      }
    }`,
    districts: gql`{districts{districtId name}}`,
    me: gql`
      {
        me {
          userId
          firstName
          lastName
          email
          role
          avatarUri
          username
          addresses {
            addressId
            address
            district
            latitude
            longitude
          }
          receiveOrders {
            orderId
            sender {
              userId
              username
              firstName
              lastName
              avatarUri
            }
            senderAddress {
              addressId
              address
              district
            }
            status
            createdAt
          }
          followers {
            follower {
              userId
              firstName
              lastName
              email
              role
              username
              avatarUri
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
              avatarUri
            }
          }
        }
      }
    `,
    users: gql`
      query($search: String!) {
        users(search: $search) {
          userId
          firstName
          lastName
          email
          role
          username
          avatarUri
        }
      }
    `,
    addresses: gql`
      query($userId: Int!) {
        addresses(userId: $userId) {
          addressId
          address
          district
          latitude
          longitude
        }
      }
    `,
  },
  mutation: {
    createOrder: gql`
      mutation createOrder($input: CreateOrderInput) {
        createOrder(input: $input) {
          orderId
          sender {
            userId
            username
          }
          senderAddress {
            addressId
            address
          }
          receiver {
            userId
            username
          }
          receiverAddress {
            addressId
            address
          }
          status
          driver {
            userId
            username
          }
        }
      }
    `,
    signIn: gql`
      mutation($input: SignInInput) {
        signIn(input: $input) {
          userId
          firstName
          lastName
          email
          role
          username
          avatarUri
        }
      }
    `,
    signUp: gql`
      mutation($input: SignUpInput) {
        signUp(input: $input) {
          userId
          firstName
          lastName
          email
          role
          username
          avatarUri
        }
      }
    `,
    signOut: gql`
      mutation {
        signOut
      }
    `,
    addFriend: gql`
      mutation($userId: Int!) {
        addFriend(userId: $userId) {
          userId
          firstName
          lastName
          email
          role
          username
          avatarUri
          followers {
            follower {
              userId
              firstName
              lastName
              email
              role
              username
              avatarUri
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
              avatarUri
            }
          }
        }
      }
    `,
  },
};

export default schema;
