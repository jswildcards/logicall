import { ListItem, Left, Thumbnail, Body, Text } from "native-base";
import React from "react";

function AvatarItem(props) {
  const {
    item,
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
            uri: `https://picsum.photos/200/300?random=${item.userId}`,
          }}
        />
      </Left>
      <Body style={{ minHeight: 70, flex: 1, justifyContent: "center" }}>
        <Text>{`${item.firstName} ${item.lastName}`}</Text>
        <Text note>{`@${item.username}`}</Text>
      </Body>
      {right}
    </ListItem>
  );
}

export default AvatarItem;
