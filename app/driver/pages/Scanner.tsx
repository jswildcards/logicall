import {
  Body,
  Container,
  Content,
  Icon,
  Left,
  ListItem,
  Text,
} from "native-base";
import React from "react";
import { useMutation, useQuery } from "react-apollo";
import { StatusBar, View } from "react-native";
import { Actions } from "react-native-router-flux";
import QRScanner from "../components/QRScanner";
import schema from "../utils/schema";

function Page() {
  const { data: me } = useQuery(schema.query.me);

  return (
    <Container>
      <StatusBar />
      <ListItem icon itemDivider last>
        <Left>
          <Icon name="qr-scanner" />
        </Left>
        <Body>
          <Text>QR Scanner</Text>
        </Body>
      </ListItem>
      <View style={{ flex: 1 }}>
        <QRScanner
          onBarCodeRead={async ({ data }) => {
            const parsedData = JSON.parse(data);

            const payload = {
              ...parsedData,
              comments: `${parsedData.comments} @${me.me.username}`,
            }

            Actions.scanResult({ data: payload });
          }}
        />
      </View>
    </Container>
  );
}

export default Page;
