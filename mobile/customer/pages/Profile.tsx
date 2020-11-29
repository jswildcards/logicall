import React from "react";
import { Mutation, useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import { StatusBar, useWindowDimensions, Image } from "react-native";
import {
  Container,
  Content,
  List,
  Text,
  Button,
  View,
  CardItem,
} from "native-base";
import schema, { client } from "../utils/schema";
import banner from "../assets/logicall-banner.png";
import Placeholder from "../components/Placeholder";
import AvatarItem from "../components/AvatarItem";
import FixedContainer from "../components/FixedContainer";

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


        <FixedContainer pad>
          <List>
            <AvatarItem {...data.me} />
          </List>

          <Mutation
            mutation={schema.mutation.signOut}
            onCompleted={() => {
              client.cache.reset();
              Actions.replace("signIn");
            }}
          >
            {(mutation) => (
              <Button style={{ marginTop: 12 }} block onPress={mutation} danger>
                <Text>Sign Out</Text>
              </Button>
            )}
          </Mutation>
        </FixedContainer>
      </Content>
    </Container>
  );
}

export default Page;
