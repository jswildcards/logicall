// app/ScarletScreen.js

import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, useWindowDimensions, SectionList } from "react-native";
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

function Page() {
  // const [receiver, setReceiver] = useState("");
  const [data] = useState([
    { value: 'Albania', key: 'AL' },
    { value: 'Canada', key: 'CA' },
    { value: 'Benin', key: 'BJ' },
    { value: 'Guinea', key: 'GN' },
    { value: 'Ethiopia', key: 'ET' },
    { value: 'Azerbaijan', key: 'AZ' },
    { value: 'Bermuda', key: 'BM' },
    { value: 'Greece', key: 'GR' },
    { value: 'Hong Kong', key: 'HK' },
    { value: 'Hungary', key: 'HU' },
    { value: 'India', key: 'IN' },
    { value: 'Ireland', key: 'IE' },
    { value: 'Dominica', key: 'DM' },
    { value: 'Jamaica', key: 'JM' },
    { value: 'Mexico', key: 'MX' },
    { value: 'Lithuania', key: 'LT' },
    { value: 'Luxembourg', key: 'LU' },
    { value: 'New Zealand', key: 'NZ' },
    { value: 'Portugal', key: 'PT' },
    { value: 'Japan', key: 'JP' },
    { value: 'France', key: 'FR' },
    { value: 'Egypt', key: 'EG' },
    { value: 'Finland', key: 'FI' },
    { value: 'China', key: 'CN' },
    { value: 'Denmark', key: 'DK' }
  ])

  const makeList = (receiver = "") => {
    return data.filter(item => item.value.toLowerCase().includes(receiver.toLowerCase())).sort((a, b) => a.value > b.value ? 1 : -1).reduce((prev, cur) => {
      const section = prev.find(item => item.title === cur.value[0])

      if (section) {
        section.data.push(cur)
        return prev
      }

      return [
        ...prev,
        { title: cur.value[0], data: [cur] }
      ]
    }, [])
  }

  const [listItem, setListItem] = useState(makeList(""))

  const renderList = (receiver = "") => setListItem(makeList(receiver));
  // const [isLoading, setLoading] = useState(true)

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
          <Title>Select Receiver</Title>
          <Subtitle>Create Order</Subtitle>
        </Body>
        <Right>
          <Button onPress={() => Actions.profile()} transparent>
            <Text>Next</Text>
          </Button>
        </Right>
      </Header>
      {/* <View style={}> */}

      <SectionList
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
      />
      {/* </View> */}
    </Container>
  );
}

export default Page;
