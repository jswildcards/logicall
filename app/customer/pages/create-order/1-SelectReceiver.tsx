import React, { useState } from "react";
import { StatusBar, StyleSheet, SectionList } from "react-native";
import {
  Container,
  Text,
  Button,
  H3,
  Item,
  Icon,
  Input,
  Right,
} from "native-base";
import { useLazyQuery, } from "react-apollo";
import { Actions } from "react-native-router-flux";
import { Title } from "react-native-paper";
import schema from "../../utils/schema";
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
    // fontWeight: "bold",
    color: "#434343",
    marginTop: 12,
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
  const [search, setSearch] = useState("");
  const [isRefreshing, setRefreshing] = useState(false);
  const [getUsers, { data: lazyData, refetch: lazyRefetch }] = useLazyQuery(
    schema.query.users
  );

  const userSearching = (word: string) => {
    setSearch(word);
    if (word.length > 1) getUsers({ variables: { search: word } });
  };

  const makeList = (rawList = lazyData?.users) => {
    if (!rawList) return null;

    return rawList
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

  return (
    <Container>
      <StatusBar />
      <HeaderNav
        title="Receiver"
        subtitle="Create Order"
        right={
          receiver && (
            <Button
              onPress={() => Actions.createOrder2SelectSendAddress({ receiver })}
              transparent
            >
              <Text>Next</Text>
            </Button>
          )
        }
      />

      <SectionList
        sections={makeList()}
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
          <Title style={styles.sectionHeader}>{section.title}</Title>
        )}
        keyExtractor={(item) => item.userId}
        onRefresh={async () => {
          setRefreshing(true);
          await lazyRefetch();
          setRefreshing(false);
        }}
        refreshing={isRefreshing}
        ListHeaderComponent={(
          <FixedContainer pad>
            <H3 style={styles.bold}>First, Select a receiver...</H3>
            <Item floatingLabel last>
              <Input
                value={search}
                onChangeText={userSearching}
                placeholder="Search receiver..."
              />
            </Item>
          </FixedContainer>
        )}
      />
    </Container>
  );
}

export default Page;
