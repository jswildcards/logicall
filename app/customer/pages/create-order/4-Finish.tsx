import { ApolloError } from "apollo-boost";
import { Button, Container, Content, ListItem, Text, Toast } from "native-base";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { StatusBar, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import AddressItem from "../../components/AddressItem";
import AvatarItem from "../../components/AvatarItem";
import FixedContainer from "../../components/FixedContainer";
import HeaderNav from "../../components/HeaderNav";
import schema from "../../utils/schema";

const styles = StyleSheet.create({
  margin: {
    margin: 12,
  },
});

function Page(props: {
  sender: any;
  receiver: any;
  receiveLatLng: any;
  sendLatLng: any;
  receiveAddress: any;
  sendAddress: any;
}) {
  const {
    sender,
    receiver,
    receiveLatLng,
    sendLatLng,
    receiveAddress,
    sendAddress,
  } = props;
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
            <Text>Sender</Text>
          </ListItem>
          <AvatarItem item={sender} />
          <ListItem itemDivider>
            <Text>Sender Address</Text>
          </ListItem>
          <AddressItem item={{ address: sendAddress, latlng: sendLatLng }} />
          <ListItem itemDivider>
            <Text>Receiver</Text>
          </ListItem>
          <AvatarItem item={receiver} />
          <ListItem itemDivider>
            <Text>Receiver Address</Text>
          </ListItem>
          <AddressItem
            item={{ address: receiveAddress, latlng: receiveLatLng }}
          />
          <Button
            block
            success
            style={styles.margin}
            onPress={() =>
              createOrder({
                variables: {
                  input: {
                    senderId: Number(sender.userId),
                    receiverId: Number(receiver.userId),
                    sendAddress,
                    receiveAddress,
                    sendLatLng,
                    receiveLatLng,
                  },
                },
              })
            }
          >
            <Text>Confirm</Text>
          </Button>
        </FixedContainer>
      </Content>
    </Container>
  );
}

export default Page;
