import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import Constants from "expo-constants";
import { WebSocketLink } from "apollo-link-ws";
import { split, ApolloLink } from "apollo-boost";
import { getMainDefinition } from "apollo-utilities";

const wsLink = new WebSocketLink({
  uri: `ws://${Constants.manifest.extra.host}/api`,
  options: {
    reconnect: true,
  },
});

const httpLink = createHttpLink({
  uri: `http://${Constants.manifest.extra.host}/api`,
  credentials: "include",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: ApolloLink.from([splitLink]),
  cache: new InMemoryCache(),
});

export const schema = {
  query: {
    me: gql`
      {
        me {
          userId
          firstName
          lastName
          email
          role
          phone
          username
          jobs {
            status
            polylines
            order {
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
              sendLatLng {
                latitude
                longitude
              }
              receiveAddress
              receiveLatLng {
                latitude
                longitude
              }
              status
              comments
              createdAt
              updatedAt
            }
          }
          currentJobs {
            status
            polylines
            order {
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
              sendLatLng {
                latitude
                longitude
              }
              receiveAddress
              receiveLatLng {
                latitude
                longitude
              }
              status
              comments
              createdAt
              updatedAt
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
          phone
          role
          username
        }
      }
    `,
    orders: gql`
      {
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
          sendLatLng {
            latitude
            longitude
          }
          receiveAddress
          receiveLatLng {
            latitude
            longitude
          }
          status
          comments
        }
      }
    `,
  },
  mutation: {
    updateOrderStatus: gql`
      mutation($input: UpdateOrderStatusInput) {
        updateOrderStatus(input: $input) {
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
          sendLatLng {
            latitude
            longitude
          }
          receiveAddress
          receiveLatLng {
            latitude
            longitude
          }
          status
          comments
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
          phone
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
          phone
        }
      }
    `,
    signOut: gql`
      mutation {
        signOut
      }
    `,
    updateCurrentLocation: gql`
      mutation($input: LatLngInput) {
        updateCurrentLocation(input: $input) {
          latLng {
            latitude
            longitude
          }
        }
      }
    `,
  },
  subscription: {
    currentLocationRequested: gql`
      subscription {
        currentLocationRequested
      }
    `,
  },
};

export default schema;
