import React from "react";
import { StatusBar } from "react-native";
import {
  Container,
  Text,
  Button,
  Body,
  Content,
  Fab,
  Icon,
  List,
  ListItem,
  Left,
} from "native-base";
import { useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import EmptyIcon from "../components/icons/EmptyIcon";
import schema from "../utils/schema";
import NoData from "../components/NoData";
import FixedContainer from "../components/FixedContainer";
import OrderListItem from "../components/OrderListItem";
import NoOrderItem from "../components/NoOrderItem";

function Page() {
  const { loading, error, data } = useQuery(schema.query.me, {
    pollInterval: 500,
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
          button={(
            <Button
              onPress={() =>
                Actions.createOrder1SelectReceiver({ me: data.me })}
            >
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
        <FixedContainer>
          <ListItem itemDivider icon>
            <Left>
              <Icon
                style={{ transform: [{ rotate: "90deg" }] }}
                name="log-in"
                ios="ios-log-in"
              />
            </Left>
            <Body>
              <Text>Receive</Text>
            </Body>
          </ListItem>
          <List>
            {data.me.receiveOrders.map((order) => (
              <OrderListItem key={order.orderId} order={order} />
            ))}
            {data.me.receiveOrders.length === 0 && (
              <NoOrderItem hint="No receive orders yet." />
            )}
          </List>
          <ListItem itemDivider icon>
            <Left>
              <Icon
                style={{ transform: [{ rotate: "-90deg" }] }}
                name="log-out"
                ios="ios-log-out"
              />
            </Left>
            <Body>
              <Text>Send</Text>
            </Body>
          </ListItem>
          <List>
            {data.me.sendOrders.map((order) => (
              <OrderListItem key={order.orderId} order={order} />
            ))}
            {data.me.sendOrders.length === 0 && (
              <NoOrderItem hint="No send orders yet." />
            )}
          </List>
        </FixedContainer>
      </Content>
      <Fab
        style={{ backgroundColor: "#5067FF" }}
        position="bottomRight"
        onPress={() => Actions.createOrder1SelectReceiver({ me: data.me })}
      >
        <Icon ios-name="ios-add" name="add" />
      </Fab>
    </Container>
  );
}

export default Page;
