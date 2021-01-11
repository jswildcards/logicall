import { Container, Content } from "native-base";
import React from "react";
import { StatusBar, View } from "react-native";
import HeaderNav from "../components/HeaderNav";
import Map from "../components/Map";

function Page({ job }) {
  const { order, polylines } = job;

  return (
    <Container>
      <StatusBar />
      <HeaderNav title="Routing" subtitle={`Order ${order.orderId}`} />
      <View style={{ flex: 1 }}>
        <Map
          sendLatLng={order.sendLatLng}
          receiveLatLng={order.receiveLatLng}
          polylines={polylines}
        />
      </View>
    </Container>
  );
}

export default Page;
