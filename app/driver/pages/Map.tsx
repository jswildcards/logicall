import { Container, Content } from "native-base";
import React from "react";
import { StatusBar } from "react-native";
import HeaderNav from "../components/HeaderNav";
import Map from "../components/Map";

function Page({ job }) {
  const { order, polyline } = job;

  return (
    <Container>
      <StatusBar />
      <HeaderNav title="Routing" subtitle={`Order ${order.orderId}`} />
      <Content>
        <Map
          sendLatLng={order.sendLatLng}
          receiveLatLng={order.receiveLatLng}
          polyline={polyline}
        />
      </Content>
    </Container>
  );
}

export default Page;
