// app/ScarletScreen.js

import React, { useState } from "react";
import { StatusBar, TouchableOpacity, StyleSheet, SectionList, useWindowDimensions } from "react-native";
import {
  Container,
  Grid,
  Text,
  Button,
  Col,
  Row,
  H1,
  H3,
  // Body,
  View, Content, Header, Item, Icon, Input, Right
} from "native-base";
import { useLazyQuery, useQuery } from "react-apollo";
import EmptyIcon from "../components/icons/EmptyIcon";
import schema from "../utils/schema";
import { bp } from "../styles";

const styles = StyleSheet.create({
  col: {
    flex: 1,
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  header: {
    marginTop: 12,
    color: "#536DFE",
  },
  bold: {
    fontWeight: "bold",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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
});

function Page() {
  const { loading, error, data } = useQuery(schema.query.me);
  const [getUsers, { data: lazyData }] = useLazyQuery(schema.query.users);
  const [search, setSearch] = useState("")

  if (loading) {
    return (
      <Container>
        <StatusBar />
        <Text>loading</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <StatusBar />
        <Text>error</Text>
      </Container>
    );
  }

  const { followers, followees } = data.me;

  const userSearching = (word: string) => {
    setSearch(word);

    if (word.length > 1)
      getUsers({ variables: { search: word } });
  }

  const makeList = () => {
    if (!lazyData)
      return null;

    return lazyData.users.sort((a, b) => a.username > b.username ? 1 : -1).reduce((prev, cur) => {
      const section = prev.find(item => item.title === cur.username[0])

      if (section) {
        section.data.push(cur)
        return prev
      }

      return [
        ...prev,
        { title: cur.username[0], data: [cur] }
      ]
    }, [])
  }

  return (
    <Container>
      <StatusBar />
      <Header searchBar rounded>
        <Item>
          <Icon ios="ios-search" name="search" />
          <Input value={search} onChangeText={userSearching} placeholder="Search" />
          <Button style={{ margin: -2 }} onPress={() => setSearch("")} transparent light>
            <Icon ios="ios-close-circle" name="close-circle" />
          </Button>
        </Item>
      </Header>

      <SectionList
        style={{ ...styles.header, ...bp(useWindowDimensions()).root }}
        ListHeaderComponent={(
          <Grid style={{ paddingVertical: 12 }}>
            <Row>
              <Col>
                <TouchableOpacity onPress={() => console.log('hi')}>
                  <H3 style={{ alignSelf: "center" }}>{followers.length}</H3>
                  <Text style={{ alignSelf: "center" }}>Followers</Text>
                </TouchableOpacity>
              </Col>
              <Col>
                <TouchableOpacity onPress={() => console.log('hi')}>
                  <H3 style={{ alignSelf: "center" }}>{followees.length}</H3>
                  <Text style={{ alignSelf: "center" }}>Followees</Text>
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
        )}
        sections={makeList()}
        renderItem={({ item }) => <Text style={styles.item}>{item.username}</Text>}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        keyExtractor={(item) => item.userId}
      />
    </Container>
  );
}

export default Page;
