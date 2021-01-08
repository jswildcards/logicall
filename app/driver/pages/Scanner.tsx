import { Container, Content } from "native-base";
import React from "react";
import { StatusBar, View } from "react-native";
import QRScanner from "../components/QRScanner";

function Page() {
  return (
    <Container>
      <StatusBar />
      <View style={{ flex: 1 }}>
        <QRScanner />
      </View>
    </Container>
  );
}

export default Page;
