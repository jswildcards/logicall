import { ListItem, Left, Icon, Body, Right, Text } from "native-base";
import React from "react";

function AddressItem(props) {
  const { right, onPress, selected, button, item } = props;

  return (
    <ListItem
      avatar
      button={button}
      onPress={onPress}
      selected={selected}
    >
      <Left>
        <Icon ios="ios-navigate" name="navigate" />
      </Left>
      <Body>
        <Text>{item.address}</Text>
        <Text note>
          {item.latlng}
        </Text>
      </Body>
      {right}
    </ListItem>
  );
}

export default AddressItem;
