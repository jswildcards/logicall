import React, { useState } from "react";
import {
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  useWindowDimensions,
  Animated,
  I18nManager,
} from "react-native";
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
  View,
  Content,
  Header,
  Item,
  Icon,
  Input,
  Toast,
  List,
  Body,
  ListItem,
  Right,
} from "native-base";
import { Mutation, useLazyQuery, useQuery } from "react-apollo";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { ApolloError } from "apollo-boost";
import { Actions } from "react-native-router-flux";
import EmptyIcon from "../components/icons/EmptyIcon";
import schema from "../utils/schema";
import NoData from "../components/NoData";
import AddFriendsIcon from "../components/icons/AddFriendsIcon";
import AvatarItem from "../components/AvatarItem";
import FixedContainer from "../components/FixedContainer";

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
    marginTop: 8,
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
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  leftAction: {
    flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    // padding: 2,
  },
  rightAction: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

function SwipeableRow(props) {
  const { children, userId, lazyRefetch, refetch } = props;

  const addFriendErrorHandler = (err: ApolloError) => {
    const msg = err.message.replace("GraphQL error: ", "");
    Toast.show({ text: msg, buttonText: "OK", type: "danger", duration: 6000 });
  };

  const renderRightAction = (text, color, x, progress, icon) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <Mutation
          mutation={schema.mutation.addFriend}
          onCompleted={refetch}
          onError={addFriendErrorHandler}
          variables={{ userId }}
        >
          {(mutation) => (
            <RectButton
              style={[styles.rightAction, { backgroundColor: color }]}
              onPress={mutation}
            >
              <View>{icon}</View>
              <Text style={styles.actionText}>{text}</Text>
            </RectButton>
          )}
        </Mutation>
      </Animated.View>
    );
  };

  const renderRightActions = (progress) => (
    <View
      style={{
        width: 96,
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
      }}
    >
      {renderRightAction(
        "Add",
        "#5cb85c",
        96,
        progress,
        <Icon
          style={{ ...styles.actionText, fontSize: 32 }}
          ios="ios-add"
          name="add"
        />
      )}
    </View>
  );

  return (
    <Swipeable
      // ref={this.updateRef}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      // renderLeftActions={this.renderLeftActions}
      renderRightActions={renderRightActions}
    >
      {children}
    </Swipeable>
  );
}

function ConditionRender(props) {
  const {
    isSearching,
    followees,
    followerNumber,
    followeeNumber,
    makeList,
    lazyRefetch,
    refetch,
    isRefreshing,
    setRefreshing,
  } = props;

  if (isSearching) {
    return (
      <SectionList
        sections={makeList()}
        renderItem={({ item }) => (
          <SwipeableRow
            userId={parseInt(item.userId)}
            lazyRefetch={lazyRefetch}
            refetch={refetch}
          >
            <AvatarItem item={item} />
          </SwipeableRow>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item) => item.userId}
        onRefresh={async () => {
          setRefreshing(true);
          await lazyRefetch();
          setRefreshing(false);
        }}
        refreshing={isRefreshing}
      />
    );
  }

  if (followeeNumber === 0 && followerNumber === 0) {
    return (
      <NoData
        icon={<AddFriendsIcon height="30%" />}
        title="Don't you feel lonely?"
        subtitle="Search above and add your friends!"
      />
    );
  }

  return (
    <FixedContainer>
      <SectionList
        style={styles.header}
        ListHeaderComponent={(
          <Grid style={{ paddingVertical: 12 }}>
            <Row>
              {/* <Col>
                <TouchableOpacity onPress={() => console.log("hi")}>
                  <H3 style={{ alignSelf: "center" }}>{followerNumber}</H3>
                  <Text style={{ alignSelf: "center" }}>Followers</Text>
                </TouchableOpacity>
              </Col> */}
              <Col>
                <TouchableOpacity>
                  <H3 style={{ alignSelf: "center" }}>{followeeNumber}</H3>
                  <Text style={{ alignSelf: "center" }}>Followees</Text>
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
        )}
        sections={makeList(followees.map(({ followee }) => followee))}
        renderItem={({ item }) => (
          <AvatarItem
            item={item}
            button
            onPress={() => {
              Actions.createOrder2SelectAddress({ receiver: item });
            }}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item) => item.userId}
      />
    </FixedContainer>
  );
}

function Page() {
  const { loading, error, data, refetch } = useQuery(schema.query.me);
  const [getUsers, { data: lazyData, refetch: lazyRefetch }] = useLazyQuery(
    schema.query.users
  );
  const [search, setSearch] = useState("");
  const [isRefreshing, setRefreshing] = useState(false);

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

  const fullRefetch = async () => {
    await refetch();
    await lazyRefetch();
  };

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
      <Header searchBar rounded>
        <Item>
          <Icon ios="ios-search" name="search" />
          <Input
            value={search}
            onChangeText={userSearching}
            placeholder="Search"
          />
          <Right>
            <Button
              // style={{ margin: -2 }}
              onPress={() => userSearching("")}
              transparent
              light
            >
              <Icon ios="ios-close-circle" name="close-circle" />
            </Button>
          </Right>
        </Item>
      </Header>

      <ConditionRender
        isSearching={search.length > 1}
        followerNumber={followers.length}
        followeeNumber={followees.length}
        followees={followees}
        isRefreshing={isRefreshing}
        setRefreshing={setRefreshing}
        lazyRefetch={lazyRefetch}
        refetch={fullRefetch}
        makeList={makeList}
      />
    </Container>
  );
}

export default Page;
