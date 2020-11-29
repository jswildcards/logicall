import React from "react";
import { Body, Button, Header, Left, Right, Subtitle, Text, Title } from "native-base";
import { Actions } from "react-native-router-flux";

function HeaderBackButton({ right = null, title, subtitle = null }) {
  return (
    <Header>
      <Left>
        <Button onPress={() => Actions.pop()} transparent>
          <Text>Back</Text>
        </Button>
      </Left>
      <Body>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Body>
      <Right>{right}</Right>
    </Header>
  );
}

export default HeaderBackButton;
