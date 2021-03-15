import { ListItem, Left, Icon, Body, Text } from "native-base";
import React from "react";

export function NoOrderItem(props) {
  const { hint } = props;
  return (
    <ListItem icon last>
      <Left>
        <Icon style={{ color: "red" }} name="close" ios="ios-close" />
      </Left>
      <Body>
        <Text>{hint}</Text>
      </Body>
    </ListItem>
  );
}

export default NoOrderItem;
