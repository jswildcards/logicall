import React from "react";
import {
  Body,
  Button,
  Header,
  Icon,
  Left,
  Right,
  Subtitle,
  Text,
  Title,
} from "native-base";
import { Actions } from "react-native-router-flux";

function HeaderNav({
  title,
  subtitle = null,
  right = null,
}: {
  title: string;
  subtitle: string | null;
  right: any | null;
}) {
  return (
    <Header>
      <Left>
        <Button onPress={() => Actions.pop()} transparent>
          <Icon ios="ios-arrow-back" name="arrow-back" />
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

export default HeaderNav;
