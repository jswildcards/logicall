import { Container, Fab, Icon } from "native-base";
import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { StatusBar, View } from "react-native";
import HeaderNav from "../components/HeaderNav";
import Map from "../components/Map";
import { mapStringToPolylines } from "../utils/convert";
import schema from "../utils/schema";

function Page({ job }) {
  const { order, polylines } = job;
  const [visitedLatLng, setVisitedLatLng] = useState(0);
  const polylineLatLngs = mapStringToPolylines(polylines);
  const [updateCurrentLocation] = useMutation(
    schema.mutation.updateCurrentLocation
  );

  const move = () => {
    if (visitedLatLng < polylineLatLngs.length) {
      const [latitude, longitude] = polylineLatLngs[visitedLatLng];
      updateCurrentLocation({
        variables: { input: { latitude, longitude } },
      });
      setVisitedLatLng(visitedLatLng + Math.floor(polylineLatLngs.length / 10));
    }
  };

  const getCurrentLatLng = () => {
    const [latitude, longitude] =
      polylineLatLngs[visitedLatLng] ??
      polylineLatLngs[polylineLatLngs.length - 1];
    return { latitude, longitude };
  };

  return (
    <Container>
      <StatusBar />
      <HeaderNav title="Routing" subtitle={`Order ${order.orderId}`} />
      <View style={{ flex: 1 }}>
        <Map
          sendLatLng={order.sendLatLng}
          receiveLatLng={order.receiveLatLng}
          sendAddress={order.sendAddress}
          receiveAddress={order.receiveAddress}
          currentLatLng={getCurrentLatLng()}
          polylines={polylines}
        />
      </View>
      <Fab
        style={{ backgroundColor: "#5067FF" }}
        position="bottomLeft"
        onPress={move}
      >
        <Icon ios-name="ios-bicycle" name="bicycle" />
      </Fab>
    </Container>
  );
}

export default Page;
