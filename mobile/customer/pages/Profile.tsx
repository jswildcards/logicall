// app/ScarletScreen.js

import React from "react";
import { Mutation, useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import { StatusBar, useWindowDimensions } from "react-native";
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
import schema, { client } from "../utils/schema";

import { bp } from "../styles";

function Page() {
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
    <Container style={bp(useWindowDimensions()).root}>
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
          onCompleted={() => {
            client.cache.reset();
            Actions.replace("signIn");
          }}
        >
          {(mutation) => (
            <Button block onPress={mutation} danger>
              <Text>Sign Out</Text>
            </Button>
          )}
        </Mutation>
      </Content>
    </Container>
  );
}

export default Page;
