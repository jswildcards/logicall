import React from "react";
import { useMutation, useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import { StatusBar, Image } from "react-native";
import {
  Container,
  Content,
  List,
  Text,
  Button,
  CardItem,
} from "native-base";
import schema, { client } from "../utils/schema";
import banner from "../assets/logicall-banner.png";
import Placeholder from "../components/Placeholder";
import AvatarItem from "../components/AvatarItem";
import FixedContainer from "../components/FixedContainer";

function Page() {
  const { loading, error, data } = useQuery(schema.query.me);
  const [signOut] = useMutation(schema.mutation.signOut, {
    onCompleted: () => {
      client.cache.reset();
      Actions.replace("signIn");
    },
  });

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
            <AvatarItem item={data.me} />
          </List>

          <Button style={{ marginTop: 12 }} block onPress={signOut} danger>
            <Text>Sign Out</Text>
          </Button>
        </FixedContainer>
      </Content>
    </Container>
  );
}

export default Page;
