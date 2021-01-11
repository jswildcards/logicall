import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import {
  Container,
  Grid,
  Text,
  Button,
  Col,
  Row,
  H1,
  H3,
  // Body,
  View,
  Body,
  Card,
  CardItem,
  Content,
  List,
  Fab,
} from "native-base";
import { useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import moment from "moment-timezone";
import EmptyIcon from "../components/icons/EmptyIcon";
import schema from "../utils/schema";
import NoData from "../components/NoData";
import FixedContainer from "../components/FixedContainer";
import AvatarItem from "../components/AvatarItem";
import QRCodeComponent from "../components/QRCode";

const styles = StyleSheet.create({
  col: {
    flex: 1,
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  header: {
    marginTop: 8,
    color: "#536DFE",
  },
  bold: {
    fontWeight: "bold",
  },
});

function Page() {
  const { loading, error, data } = useQuery(schema.query.me);

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
          button={(
            <Button onPress={() => Actions.createOrder1SelectReceiver()}>
              <Text>Create Order</Text>
            </Button>
          )}
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
                      .tz(parseInt(order.createdAt), "Asia/Hong_Kong")
                      .format("YYYY-MM-DD HH:mm")}`}
                  </Text>
                  <QRCodeComponent
                    data={{
                      orderId: order.orderId,
                      status: "Delivered",
                      comments: `Delivered to @${data.me.username} by`
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
                      .tz(parseInt(order.createdAt), "Asia/Hong_Kong")
                      .format("YYYY-MM-DD HH:mm")}`}
                  </Text>
                  <QRCodeComponent
                    data={{
                      orderId: order.orderId,
                      status: "Delivering",
                      comments: `Received from @${data.me.username} by`
                    }}
                  />
                </Body>
              </CardItem>
            </Card>
          ))}

          {/* <Fab /> */}
        </FixedContainer>
      </Content>
    </Container>
  );
}

export default Page;
