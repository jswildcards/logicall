import { ApolloError } from "apollo-boost";
import {
  Button,
  Container,
  Content,
  ListItem,
  Text,
  Toast,
} from "native-base";
import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { StatusBar } from "react-native";
import { Actions } from "react-native-router-flux";
import AddressItem from "../../components/AddressItem";
import AvatarItem from "../../components/AvatarItem";
import FixedContainer from "../../components/FixedContainer";
import HeaderNav from "../../components/HeaderNav";
import schema from "../../utils/schema";

function Page(props: { receiver: any; receiveAddress: any; sendAddress: any; }) {
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

  const [createOrder] = useMutation(schema.mutation.createOrder, {
    onCompleted: createOrderCallBack,
    onError: createOrderErrorHandler,
  });

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
        <Button
          block
          onPress={() =>
            createOrder({
              variables: {
                input: {
                  receiverId: parseInt(receiver.userId),
                  sendAddressId: parseInt(sendAddress.addressId),
                  receiveAddressId: parseInt(receiveAddress.addressId),
                },
              },
            })}
        >
          <Text>Confirm</Text>
        </Button>
      </Content>
    </Container>
  );
}

export default Page;
