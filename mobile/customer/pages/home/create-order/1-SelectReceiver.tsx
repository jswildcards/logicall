// app/ScarletScreen.js

import React, { useState } from "react";
import { StatusBar, StyleSheet, useWindowDimensions } from "react-native";
import {
  Container,
  Grid,
  Text,
  Button,
  Col,
  // Row,
  // H1,
  H3,
  Body,
  // View,
  Item,
  Icon,
  Subtitle,
  Input,
  Header,
  Left,
  Title,
  Right,
  List,
  ListItem,
  Separator,
  Content,
} from "native-base";
import { useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import EmptyIcon from "../../../components/icons/EmptyIcon";
import schema from "../../../utils/schema";
import { bp } from "../../../styles";

const styles = StyleSheet.create({
  col: {
    // flex: 1,
  },
  row: {
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
  },
  body: {
    // alignSelf: "center",
    // flexDirection: "row",
    // justifyContent: "center",
  },
  header: {
    // marginTop: 12,
    // color: "#536DFE",
  },
  bold: {
    fontWeight: "bold",
    marginTop: 12,
  },
});

function Page() {
  const [receiver, setReceiver] = useState("");

  return (
    <Container>
      <StatusBar />
      <Header>
        <Left>
          <Button onPress={() => Actions.pop()} transparent>
            <Icon ios="ios-arrow-back" name="arrow-back" />
            <Text>Home</Text>
          </Button>
        </Left>
        <Body>
          <Title>Select Receiver</Title>
          <Subtitle>Create Order</Subtitle>
        </Body>
        <Right>
          <Button onPress={() => Actions.profile()} transparent>
            <Text>Next</Text>
          </Button>
        </Right>
      </Header>
      <Content style={bp(useWindowDimensions()).root}>
        <H3 style={styles.bold}>First, Select a receiver...</H3>
        <Item floatingLabel last>
          <Input
            placeholder="search receivers..."
            value={receiver}
            onChangeText={(receiver) => setReceiver(receiver)}
          />
        </Item>

        <List style={styles.bold}>
          <Separator bordered>
            <Text>Results</Text>
          </Separator>
          <ListItem>
            <Text>Simon Mignolet</Text>
          </ListItem>
          <ListItem>
            <Text>Nathaniel Clyne</Text>
          </ListItem>
          <ListItem>
            <Text>Dejan Lovren</Text>
          </ListItem>
          <ListItem>
            <Text>Simon Mignolet</Text>
          </ListItem>
          <ListItem>
            <Text>Nathaniel Clyne</Text>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
}

export default Page;
