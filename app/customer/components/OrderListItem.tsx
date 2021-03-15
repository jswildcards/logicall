import { ListItem, Left, Badge, Right, Icon, Text } from "native-base";
import React from "react";
import { Actions } from "react-native-router-flux";
import { mapStatusToColor } from "../utils/convert";

export function OrderListItem(props) {
  const { order } = props;
  return (
    <ListItem last onPress={() => Actions.orderDetail({ order })}>
      <Left>
        <Text>{order.orderId} </Text>
        <Badge style={mapStatusToColor(order.status)}>
          <Text style={mapStatusToColor(order.status)}>{order.status}</Text>
        </Badge>
      </Left>
      <Right>
        <Icon name="arrow-forward" ios="ios-arrow-forward" />
      </Right>
    </ListItem>
  );
}

export default OrderListItem;
