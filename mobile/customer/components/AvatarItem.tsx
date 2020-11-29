import { ListItem, Left, Thumbnail, Body, Text } from "native-base";
import React from "react";

function AvatarItem(props) {
  const {
    userId,
    firstName,
    lastName,
    username,
    button,
    onPress,
    right,
    selected,
  } = props;

  return (
    <ListItem avatar button={button} onPress={onPress} selected={selected}>
      <Left>
        <Thumbnail
          source={{
            uri: `https://picsum.photos/200/300?random=${userId}`,
          }}
        />
      </Left>
      <Body style={{ minHeight: 70, flex: 1, justifyContent: "center" }}>
        <Text>{`${firstName} ${lastName}`}</Text>
        <Text note>{`@${username}`}</Text>
      </Body>
      {right}
    </ListItem>
  );
}

export default AvatarItem;
