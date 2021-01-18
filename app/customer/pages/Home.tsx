import React from "react";
import { StatusBar } from "react-native";
import {
  Container,
  Text,
  Button,
  H3,
  Body,
  Card,
  CardItem,
  Content,
  Fab,
  Icon,
} from "native-base";
import { useMutation, useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import moment from "moment-timezone";
import EmptyIcon from "../components/icons/EmptyIcon";
import schema from "../utils/schema";
import NoData from "../components/NoData";
import FixedContainer from "../components/FixedContainer";
import AvatarItem from "../components/AvatarItem";
import QRCodeComponent from "../components/QRCode";

function Page() {
  const { loading, error, data, refetch } = useQuery(schema.query.me, {
    pollInterval: 500,
  });
  const [updateOrderStatus] = useMutation(schema.mutation.updateOrderStatus, {
    onCompleted: refetch,
  });

  if (loading) {
    return (
      <Container>
        <StatusBar />
        <Text>loading</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <StatusBar />
        <Text>error</Text>
      </Container>
    );
  }

  if (!data.me.receiveOrders?.length && !data.me.sendOrders?.length) {
    return (
      <Container>
        <StatusBar />
        <NoData
          icon={<EmptyIcon height="30%" />}
          title="No Orders Here!"
          subtitle="Do you want to create an order now?"
          button={
            <Button onPress={() => Actions.createOrder1SelectReceiver()}>
              <Text>Create Order</Text>
            </Button>
          }
        />
      </Container>
    );
  }
  return (
    <Container>
      <StatusBar />
      <Content>
        <FixedContainer pad>
          <H3 style={{ paddingTop: 12 }}>Receive Orders</H3>
          {data.me.receiveOrders.map((order) => (
            <Card>
              <AvatarItem item={order.sender} />
              <CardItem>
                <Body>
                  <Text>{order.status}</Text>
                  <Text note>
                    {`created ${moment
                      .tz(Number(order.createdAt), "Asia/Hong_Kong")
                      .format("YYYY-MM-DD HH:mm")}`}
                  </Text>
                  <QRCodeComponent
                    data={{
                      orderId: order.orderId,
                      status: "Delivered",
                      comments: `Delivered to @${data.me.username} by`,
                    }}
                  />
                </Body>
              </CardItem>
            </Card>
          ))}
          <H3 style={{ paddingTop: 12 }}>Send Orders</H3>
          {data.me.sendOrders.map((order) => (
            <Card>
              <AvatarItem item={order.receiver} />
              <CardItem>
                <Body>
                  <Text>{order.status}</Text>
                  <Text note>
                    {`created ${moment
                      .tz(Number(order.createdAt), "Asia/Hong_Kong")
                      .format("YYYY-MM-DD HH:mm")}`}
                  </Text>
                  <QRCodeComponent
                    data={{
                      orderId: order.orderId,
                      status: "Delivering",
                      comments: `Received from @${data.me.username} by`,
                    }}
                  />
                  {order.status === "Pending" && (
                    <Button
                      danger
                      style={{marginTop:12}}
                      onPress={() => {
                        updateOrderStatus({
                          variables: {
                            input: {
                              orderId: order.orderId,
                              status: "Cancelled",
                              comments: `Cancelled by @${data.me.username}`,
                            },
                          },
                        });
                      }}
                    >
                      <Text>Cancel</Text>
                    </Button>
                  )}
                </Body>
              </CardItem>
            </Card>
          ))}
        </FixedContainer>
      </Content>
      <Fab
        style={{ backgroundColor: "#5067FF" }}
        position="bottomRight"
        onPress={() => Actions.createOrder1SelectReceiver()}
      >
        <Icon ios-name="ios-add" name="add" />
      </Fab>
    </Container>
  );
}

export default Page;
