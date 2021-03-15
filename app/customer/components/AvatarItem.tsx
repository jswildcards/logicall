import { ListItem, Left, Body, Text, List, Icon } from "native-base";
import React from "react";
import { Avatar } from "react-native-paper";

function AvatarItem(props) {
  const { item, button, onPress, right, selected, includePhone } = props;

  return (
    <>
      <ListItem
        noBorder
        avatar
        button={button}
        onPress={onPress}
        selected={selected}
      >
        <Left>
          {/* <Thumbnail source={{ uri: item.avatarUri }} /> */}
          <Avatar.Text size={48} label={item.firstName[0] + item.lastName[0]} />
        </Left>
        <Body style={{ minHeight: 70, flex: 1, justifyContent: "center" }}>
          <Text>{`${item.firstName} ${item.lastName}`}</Text>
          <Text note>{`@${item.username}`}</Text>
        </Body>
        {right}
      </ListItem>
      {includePhone && (
          <ListItem icon noBorder>
            <Left>
              <Icon name="call" ios="ios-call" />
            </Left>
            <Body>
              <Text>{item.phone}</Text>
            </Body>
          </ListItem>
      )}
    </>
  );
}

export default AvatarItem;
