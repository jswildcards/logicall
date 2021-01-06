import { Container, Content, Text, Button } from "native-base";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-apollo";
import { StatusBar } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import HeaderNav from "../components/HeaderNav";
import schema from "../utils/schema";
import { decode } from "../utils/here-polyline";

function Page(props: { job: any }) {
  const {
    job: { order },
  } = props;
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [errorMsg, setErrorMsg] = useState("");
  const { data, loading, error } = useQuery(schema.query.route, {
    variables: {
      origin: `${order.sendLatLng.latitude},${order.sendLatLng.longitude}`,
      destination: `${order.receiveLatLng.latitude},${order.receiveLatLng.longitude}`,
    },
  });

  if (loading) {
    return <Text>Loading</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const [polyline] = useState(
    decode(
      JSON.parse(data.route).sections[0].polyline
    ).polyline.map(([latitude, longitude]) => ({ latitude, longitude }))
  );

  const [paths, setPaths] = useState([polyline[0]]);

  // const drive = () => {
  //   if (polyline[paths.length]) setPaths([...paths, polyline[paths.length]]);
  // };

  useEffect(() => {
    // (async () => {
    Location.requestPermissionsAsync().then(({ status }) => {
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // watchPositionAsync may have error
      Location.watchPositionAsync(
        { timeInterval: 1000 },
        ({ coords: { latitude, longitude } }) => {
          setLocation({ latitude, longitude });
          console.log(`${latitude} ${longitude}`);
        }
      );
    });
    // })();
    // setTimeout(drive, 100);
  });

  return (
    <Container>
      <StatusBar />
      <HeaderNav title="Routing" subtitle={`Order ${order.orderId}`} />
      <Content>
        <Text>{JSON.stringify(location)}</Text>
        <MapView
          style={{ width: "100%", height: 550 }}
          initialRegion={{
            latitude: order.sendLatLng.latitude,
            longitude: order.sendLatLng.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            key="send"
            coordinate={{
              latitude: order.sendLatLng.latitude!,
              longitude: order.sendLatLng.longitude!,
            }}
          />
          <Marker
            key="receive"
            coordinate={{
              latitude: order.receiveLatLng.latitude!,
              longitude: order.receiveLatLng.longitude!,
            }}
          />
          <Marker
            key="current"
            coordinate={{
              latitude: location.latitude!,
              longitude: location.longitude!,
            }}
          />
          <Polyline
            coordinates={polyline}
            strokeColor="#B24112"
            strokeWidth={4}
          />
          <Polyline coordinates={paths} strokeColor="#238C23" strokeWidth={4} />
        </MapView>
      </Content>
    </Container>
  );
}

export default Page;
