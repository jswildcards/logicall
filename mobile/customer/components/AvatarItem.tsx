import { ListItem, Left, Thumbnail, Body, Text } from "native-base";
import React from "react";

function AvatarItem(props) {
  const { userId, firstName, lastName, username, button, onPress } = props;

  return (
    <ListItem avatar button={button} onPress={onPress}>
      <Left>
        <Thumbnail
          source={{
            uri: `https://picsum.photos/200/300?random=${userId}`,
          }}
        />
      </Left>
      <Body>
        <Text>{`${firstName} ${lastName}`}</Text>
        <Text note>{`@${username}`}</Text>
      </Body>
    </ListItem>
  )
}

export default AvatarItem;
