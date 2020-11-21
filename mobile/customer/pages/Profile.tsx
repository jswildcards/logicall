// app/ScarletScreen.js

import React from "react";
import { Mutation, useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import { StatusBar } from "react-native";
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Thumbnail,
  Text,
  Button,
} from "native-base";
import schema from "../utils/schema";

const HomePage = () => {
  const { loading, error, data } = useQuery(schema.query.me);

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
        <Text>{JSON.stringify(error)}</Text>
      </Container>
    );
  }

  const { userId, firstName, lastName, username } = data.me;

  return (
    <Container>
      <StatusBar />
      <Content>
        <List>
          <ListItem noBorder avatar>
            <Left>
              <Thumbnail
                source={{
                  uri: `https://picsum.photos/200/300?random=${userId}`,
                }}
              />
            </Left>
            <Body>
              <Text>{`${firstName} ${lastName}`}</Text>
              <Text note>{`@${username}`}</Text>
            </Body>
          </ListItem>
        </List>

        <Mutation
          mutation={schema.mutation.signOut}
          onCompleted={() => Actions.replace("signIn")}
        >
          {(mutation) => (
            <Button onPress={mutation} danger>
              <Text>Sign Out</Text>
            </Button>
          )}
        </Mutation>
      </Content>
    </Container>
  );
};

export default HomePage;
