import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Button, Container, Text, Textarea } from "native-base";
import { StatusBar, StyleSheet, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { Title, Subheading } from "react-native-paper";
import FixedContainer from "../../components/FixedContainer";
import HeaderNav from "../../components/HeaderNav";

const styles = StyleSheet.create({
  text: {
    color: "#434343",
  },
  padding: {
    padding: 12,
  },
});

function Page({ sender, receiver, sendLatLng, sendAddress }) {
  const [receiveAddress, setReceiveAddress] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });

  const changeRoutingDestination = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setReceiveAddress({ ...receiveAddress, latitude, longitude });
  };

  return (
    <Container>
      <StatusBar />
      <HeaderNav
        title="Receive Address"
        subtitle="Create Order"
        right={
          receiveAddress?.latitude && (
            <Button
              onPress={() =>
                Actions.createOrder4Finish({
                  sender,
                  receiver,
                  sendAddress,
                  sendLatLng,
                  receiveAddress: receiveAddress.address,
                  receiveLatLng: `${receiveAddress.latitude},${receiveAddress.longitude}`,
                })
              }
              transparent
            >
              <Text>Next</Text>
            </Button>
          )
        }
      />
      <View style={styles.padding}>
        <Textarea
          placeholder="Address Detail"
          rowSpan={3}
          bordered
          underline={false}
          value={receiveAddress.address}
          onChangeText={(address) =>
            setReceiveAddress({ ...receiveAddress, address })
          }
        />
      </View>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 22.38131,
          longitude: 114.168639,
          latitudeDelta: 0.9,
          longitudeDelta: 0.9,
        }}
        onPress={changeRoutingDestination}
      >
        {(receiveAddress?.latitude ?? null) && (
          <Marker
            coordinate={{
              latitude: receiveAddress.latitude!,
              longitude: receiveAddress.longitude!,
            }}
          />
        )}
      </MapView>
    </Container>
  );
}

export default Page;
