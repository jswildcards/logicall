import gql from "graphql-tag";

export const schema = {
  query: {
    drivers: gql`
      {
        drivers {
          userId
          firstName
          lastName
          email
          role
          phone
          username
          currentLocation {
            at
            status
            latLng {
              latitude
              longitude
            }
          }
        }
      }
    `,
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
    user: gql`
      query($userId: Int!) {
        user(userId: $userId) {
          userId
          firstName
          lastName
          email
          phone
          role
          username
          jobs {
            jobId
            status
            polylines
            duration
            order {
              orderId
              sender {
                userId
                username
                firstName
                lastName
                role
              }
              receiver {
                userId
                username
                firstName
                lastName
                role
              }
              sendAddress
              receiveAddress
              status
              expectedCollectedTime
              expectedDeliveredTime
            }
          }
          sendOrders {
            orderId
            expectedCollectedTime
            expectedDeliveredTime
            sender {
              userId
              username
              firstName
              lastName
              email
              phone
              role
            }
            receiver {
              userId
              username
              firstName
              lastName
              email
              phone
              role
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
          receiveOrders {
            orderId
            expectedCollectedTime
            expectedDeliveredTime
            sender {
              userId
              username
              firstName
              lastName
              email
              phone
              role
            }
            receiver {
              userId
              username
              firstName
              lastName
              email
              phone
              role
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
    `,
    customers: gql`
      query {
        customers {
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
    order: gql`
      query($orderId: String) {
        order(orderId: $orderId) {
          suggestedPolylines
          estimatedDuration
          duration
          orderId
          expectedCollectedTime
          expectedDeliveredTime
          sender {
            userId
            username
            firstName
            lastName
            email
            phone
            role
          }
          receiver {
            userId
            username
            firstName
            lastName
            email
            phone
            role
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
          logs {
            orderLogId
            status
            comments
            createdAt
          }
          jobs {
            polylines
            duration
            driver {
              userId
              username
              firstName
              lastName
              role
            }
            status
          }
        }
      }
    `,
    orders: gql`
      query {
        orders {
          suggestedPolylines
          estimatedDuration
          duration
          orderId
          expectedCollectedTime
          expectedDeliveredTime
          sender {
            userId
            username
            firstName
            lastName
            email
            phone
            role
          }
          receiver {
            userId
            username
            firstName
            lastName
            email
            phone
            role
          }
          jobs {
            polylines
            duration
            driver {
              userId
              username
              firstName
              lastName
              role
            }
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
    currentLocations: gql`
      {
        currentLocations {
          user {
            userId
            username
            firstName
            lastName
            email
            phone
            role
          }
          latLng {
            latitude
            longitude
          }
        }
      }
    `,
  },
  mutation: {
    updateOrderStatus: gql`
      mutation($input: UpdateOrderStatusInput) {
        updateOrderStatus(input: $input) {
          suggestedPolylines
          estimatedDuration
          duration
          orderId
          expectedCollectedTime
          expectedDeliveredTime
          sender {
            userId
            username
            firstName
            lastName
            role
          }
          receiver {
            userId
            username
            firstName
            lastName
            role
          }
          jobs {
            polylines
            duration
            driver {
              userId
              username
              firstName
              lastName
              role
            }
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
        }
      }
    `,
    signOut: gql`
      mutation {
        signOut
      }
    `,
  },
  subscription: {
    currentLocationUpdated: gql`
      subscription {
        currentLocationUpdated {
          at
        }
      }
    `,
    orderCreated: gql`
      subscription {
        orderCreated {
          suggestedPolylines
          estimatedDuration
          duration
          orderId
          expectedCollectedTime
          expectedDeliveredTime
          sender {
            userId
            username
            firstName
            lastName
            role
          }
          receiver {
            userId
            username
            firstName
            lastName
            role
          }
          jobs {
            polylines
            duration
            driver {
              userId
              username
              firstName
              lastName
              role
            }
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
    orderStatusUpdated: gql`
      subscription {
        orderStatusUpdated {
          orderId
        }
      }
    `,
  },
};

export default schema;
