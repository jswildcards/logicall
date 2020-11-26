// app/ScarletScreen.js

import React from "react";
import { Mutation, useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import { StatusBar, useWindowDimensions, Image, TouchableOpacity } from "react-native";
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
  View,
  CardItem, Grid, Row, Col, H3
} from "native-base";
import schema, { client } from "../utils/schema";
import banner from '../assets/logicall-banner.png'
import { bp } from "../styles";
import Placeholder from "../components/Placeholder";
import AvatarItem from "../components/AvatarItem";

function Page() {
  const { loading, error, data } = useQuery(schema.query.me);

  if (loading) {
    return (
      <Container>
        <StatusBar />
        <Placeholder />
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

  // const { userId, firstName, lastName, username, followers, followees } = data.me;

  return (
    <Container>
      <StatusBar />
      <Content>
        <CardItem cardBody style={{ backgroundColor: "#7e89fd" }}>
          <Image source={banner} style={{ height: 200, flex: 1 }} />
        </CardItem>

        <List>
          <AvatarItem {...data.me} />
        </List>



        <View style={{ ...bp(useWindowDimensions()).root, paddingTop: 12 }}>
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
        </View>
      </Content>
    </Container>
  );
}

export default Page;
