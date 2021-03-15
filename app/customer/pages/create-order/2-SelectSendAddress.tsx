import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Button, Container, Text, Textarea } from "native-base";
import { StatusBar, StyleSheet, View } from "react-native";
import { Actions } from "react-native-router-flux";
import HeaderNav from "../../components/HeaderNav";

const styles = StyleSheet.create({
  text: {
    color: "#434343",
  },
  padding: {
    padding: 12,
  },
});

function Page({ sender, receiver }) {
  const [sendAddress, setSendAddress] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });

  const changeRoutingDestination = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSendAddress({ ...sendAddress, latitude, longitude });
  };

  const isFormCompleted = () => {
    return (
      sendAddress?.latitude &&
      sendAddress?.longitude &&
      sendAddress?.address?.length > 0
    );
  };

  return (
    <Container>
      <StatusBar />
      <HeaderNav
        title="Send Address"
        subtitle="Create Order"
        right={
          isFormCompleted() && (
            <Button
              onPress={() =>
                Actions.createOrder3SelectReceiveAddress({
                  sender,
                  receiver,
                  sendAddress: sendAddress.address,
                  sendLatLng: `${sendAddress.latitude},${sendAddress.longitude}`,
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
          value={sendAddress.address}
          onChangeText={(address) =>
            setSendAddress({ ...sendAddress, address })
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
        {(sendAddress?.latitude ?? null) && (
          <Marker
            coordinate={{
              latitude: sendAddress.latitude!,
              longitude: sendAddress.longitude!,
            }}
          />
        )}
      </MapView>
    </Container>
  );
}

export default Page;
