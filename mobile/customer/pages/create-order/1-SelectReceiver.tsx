// app/ScarletScreen.js

import React, { useState } from "react";
import { StatusBar, StyleSheet, SectionList } from "react-native";
import {
  Container,
  Text,
  Button,
  // Row,
  // H1,
  H3,
  Body,
  Item,
  Icon,
  Subtitle,
  Input,
  Header,
  Left,
  Title,
  Right,
} from "native-base";
import { useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import schema from "../../utils/schema";
import Placeholder from "../../components/Placeholder";
import AvatarItem from "../../components/AvatarItem";
import FixedContainer from "../../components/FixedContainer";
import HeaderNav from "../../components/HeaderNav";

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
    paddingTop: 22,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

function Page() {
  const [receiver, setReceiver] = useState(null);

  const { loading, data } = useQuery(schema.query.me);
  const { followees } = data.me;

  const makeList = (receiver = "") => {
    return followees
      .map(({ followee }) => followee)
      .filter(({ username }) =>
        username.toLowerCase().includes(receiver.toLowerCase())
      )
      .sort((a, b) => (a.username > b.username ? 1 : -1))
      .reduce((prev, cur) => {
        const section = prev.find((item) => item.title === cur.username[0]);

        if (section) {
          section.data.push(cur);
          return prev;
        }

        return [...prev, { title: cur.username[0], data: [cur] }];
      }, []);
  };

  const [listItem, setListItem] = useState(makeList(""));

  const renderList = (receiver = "") => setListItem(makeList(receiver));
  // const [isLoading, setLoading] = useState(true)

  return (
    <Container>
      <StatusBar />
      <HeaderNav
        title="Receiver"
        subtitle="Create Order"
        right={receiver && (
          <Button
            onPress={() => Actions.createOrder2SelectAddress({ receiver })}
            transparent
          >
            <Text>Next</Text>
          </Button>
        )}
      />

      {loading && <Placeholder />}

      {!loading && (
        <SectionList
          style={styles.header}
          ListHeaderComponent={(
            <FixedContainer pad>
              <H3 style={styles.bold}>First, Select a receiver...</H3>
              <Item floatingLabel last>
                <Input
                  placeholder="search receivers..."
                  // value={receiver}
                  onChangeText={(receiver) => {
                    renderList(receiver);
                  }}
                />
              </Item>
            </FixedContainer>
          )}
          sections={listItem}
          renderItem={({ item }) => (
            <AvatarItem
              item={item}
              button
              selected={item.userId === receiver?.userId}
              onPress={() => setReceiver({ ...item })}
              right={
                item.userId === receiver?.userId && (
                  <Right>
                    <Icon ios="ios-checkmark" name="checkmark" />
                  </Right>
                )
              }
            />
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item) => item.userId}
        />
      )}
    </Container>
  );
}

export default Page;
