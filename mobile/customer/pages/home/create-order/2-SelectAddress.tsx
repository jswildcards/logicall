// app/ScarletScreen.js

import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, useWindowDimensions, SectionList, RefreshControl } from "react-native";
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
  View,
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
import { Actions, Reducer } from "react-native-router-flux";
import { NetworkStatus } from "apollo-boost";
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
    marginTop: 12,
  },
  bold: {
    fontWeight: "bold",
    // marginTop: 12,
  },
  container: {
    flex: 1,
    paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

function Page(props) {
  // const [receiver, setReceiver] = useState("");

  const { loading, data, refetch, networkStatus } = useQuery(schema.query.addresses, { variables: { userId: parseInt(props.receiver.userId) } })
  const [receiveAddress, setReceiveAddress] = useState(null)

  if (loading) {
    return (<Text>loading</Text>)
  }

  return (
    <Container>
      <StatusBar />
      <Header>
        <Left>
          <Button onPress={() => Actions.pop()} transparent>
            <Icon ios="ios-arrow-back" name="arrow-back" />
            {/* <Text>Home</Text> */}
          </Button>
        </Left>
        <Body>
          <Title>Select Address</Title>
          <Subtitle>Create Order</Subtitle>
        </Body>
        <Right>
          <Button onPress={() => Actions.profile()} transparent>
            <Text>Next</Text>
          </Button>
        </Right>
      </Header>
      {/* <View style={}> */}

      <RefreshControl onRefresh={refetch} refreshing={networkStatus === NetworkStatus.refetch}>
        <List>
          {data.addresses.map((address) => (
            <ListItem avatar button onPress={() => setReceiveAddress(address)} selected={address.addressId === receiveAddress?.addressId}>
              <Left>
                <Icon ios="ios-navigate" name="navigate" />
              </Left>
              <Body>
                <Text>{address.address}</Text>
                <Text note>{`${address.district} (${address.latitude}, ${address.longitude})`}</Text>
              </Body>
              {address.addressId === receiveAddress?.addressId && (
                <Right>
                  <Icon style={{ paddingRight: 12 }} ios="ios-checkmark" name="checkmark" />
                </Right>
              )}
            </ListItem>
          ))}
        </List>
      </RefreshControl>

      {/* <SectionList
        style={{ ...styles.header, ...bp(useWindowDimensions()).root }}
        ListHeaderComponent={(
          <>
            <H3 style={styles.bold}>First, Select a receiver...</H3>
            <Item floatingLabel last>
              <Input
                placeholder="search receivers..."
                // value={receiver}
                onChangeText={(receiver) => { renderList(receiver); }}
              />
            </Item>
          </>
        )}
        sections={listItem}
        renderItem={({ item }) => <Text style={styles.item}>{item.value}</Text>}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        keyExtractor={(item) => item.key}
      /> */}
      {/* </View> */}
    </Container>
  );
}

export default Page;
