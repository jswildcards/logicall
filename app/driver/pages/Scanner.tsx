import { Container, Content } from "native-base";
import React from "react";
import { StatusBar } from "react-native";
import QRScanner from "../components/QRScanner";

function Page() {
  return (
    <Container>
      <StatusBar />
      <Content>
        <QRScanner />
      </Content>
    </Container>
  );
}

export default Page;
