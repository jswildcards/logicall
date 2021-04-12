import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Container, Fab, Icon } from "native-base";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-apollo";
import { StatusBar, View } from "react-native";
import HeaderNav from "../components/HeaderNav";
import Map from "../components/Map";
import { mapStringToPolylines } from "../utils/convert";
import schema from "../utils/schema";

function Page(props) {
  const { job } = props;
  const { order, polylines } = job;
  const [visitedLatLng, setVisitedLatLng] = useState(0);
  const [simulate, setSimulate] = useState(false);
  const polylineLatLngs = mapStringToPolylines(polylines);
  const [updateCurrentLocation] = useMutation(
    schema.mutation.updateCurrentLocation
  );
  const {
    getItem: globalCurrentOrder,
    setItem: setGlobalCurrentOrder,
  } = useAsyncStorage("currentOrder");
  const {
    getItem: globalCurrentMove,
    setItem: setGlobalCurrentMove,
  } = useAsyncStorage("currentMove");
  const { setItem: setGlobalCurrentLocation } = useAsyncStorage(
    "currentLocation"
  );
  const { getItem: globalTestMode } = useAsyncStorage("testMode");

  const getCurrentLatLng = (step: number) => {
    const [latitude, longitude] =
      polylineLatLngs[step] ?? polylineLatLngs[polylineLatLngs.length - 1];
    return { latitude, longitude };
  };

  const move = () => {
    if (visitedLatLng < polylineLatLngs.length) {
      const step = visitedLatLng + Math.floor(polylineLatLngs.length / 10);
      setVisitedLatLng(step);
      setGlobalCurrentOrder(order.orderId);
      setGlobalCurrentMove(step.toString());
      setGlobalCurrentLocation(JSON.stringify(getCurrentLatLng(step)));
      updateCurrentLocation({
        variables: { input: getCurrentLatLng(step) },
      });
    }
  };

  const componentDidMount = async () => {
    const storedOrderId = await globalCurrentOrder();
    const storedMove = await globalCurrentMove();
    setSimulate(((await globalTestMode()) ?? "false") === "true");

    if (
      storedOrderId === order.orderId &&
      (storedMove ?? undefined) !== undefined
    ) {
      setVisitedLatLng(Number(storedMove));
    }
  };

  useEffect(() => {
    componentDidMount();
  }, []);

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
          currentLatLng={getCurrentLatLng(visitedLatLng)}
          polylines={polylines}
        />
      </View>
      {simulate && (
        <Fab
          style={{ backgroundColor: "#5067FF" }}
          position="bottomLeft"
          onPress={move}
        >
          <Icon ios-name="ios-bicycle" name="bicycle" />
        </Fab>
      )}
    </Container>
  );
}

export default Page;
