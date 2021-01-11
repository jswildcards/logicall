import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import Constants from "expo-constants";

const httpLink = createHttpLink(
  { uri: `${Constants.manifest.extra.host}/api`, credentials: "include" }
  // { uri, credentials: 'include' }
);

export const client = new ApolloClient({
  link: httpLink,
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
    createJob: gql`
      mutation($origin: String) {
        createJob(origin: $origin) {
          jobId
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
  },
};

export default schema;
