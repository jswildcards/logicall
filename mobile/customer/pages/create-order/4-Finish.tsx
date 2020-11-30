import { ApolloError } from "apollo-boost";
import {
  Body,
  Button,
  Container,
  Content,
  Icon,
  Left,
  ListItem,
  Text,
  Toast,
} from "native-base";
import React, { useState } from "react";
import { Mutation, useQuery } from "react-apollo";
import { StatusBar } from "react-native";
import { Actions } from "react-native-router-flux";
import AddressItem from "../../components/AddressItem";
import AvatarItem from "../../components/AvatarItem";
import FixedContainer from "../../components/FixedContainer";
import HeaderNav from "../../components/HeaderNav";
import schema from "../../utils/schema";

function Page(props) {
  const { receiver, receiveAddress, sendAddress } = props;
  const [error, setError] = useState("");

  const createOrderCallBack = () => {
    setError("");
    Actions.popTo("_home");
  };

  const createOrderErrorHandler = (err: ApolloError) => {
    const msg = err.message.replace("GraphQL error: ", "");
    setError(msg);
    Toast.show({ text: msg, buttonText: "OK", type: "danger", duration: 6000 });
  };

  return (
    <Container>
      <StatusBar />
      <HeaderNav title="Confirm" subtitle="Create Order" />
      <Content>
        <FixedContainer>
          <ListItem itemDivider>
            <Text>Receiver</Text>
          </ListItem>
          <AvatarItem item={receiver} />
          <ListItem itemDivider>
            <Text>Receiver Address</Text>
          </ListItem>
          <AddressItem item={receiveAddress} />
          <ListItem itemDivider>
            <Text>Sender Address</Text>
          </ListItem>
          <AddressItem item={sendAddress} />
        </FixedContainer>
        <Mutation
          mutation={schema.mutation.createOrder}
          onCompleted={createOrderCallBack}
          onError={createOrderErrorHandler}
          variables={{
            input: {
              receiverId: parseInt(receiver.userId),
              sendAddressId: parseInt(sendAddress.addressId),
              receiveAddressId: parseInt(receiveAddress.addressId),
            },
          }}
        >
          {(mutation) => (
            <Button block onPress={mutation}>
              <Text>Confirm</Text>
            </Button>
          )}
        </Mutation>
      </Content>
    </Container>
  );
}

export default Page;
