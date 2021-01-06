import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Button, Container, Text, Textarea } from "native-base";
import { StatusBar, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { Title, Subheading } from "react-native-paper";
import FixedContainer from "../../components/FixedContainer";
import HeaderNav from "../../components/HeaderNav";

const styles = StyleSheet.create({
  text: {
    color: "#434343",
  },
});

function Page({ receiver }) {
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
                Actions.createOrder3SelectSendAddress({
                  receiver,
                  receiveAddress: receiveAddress.address,
                  receiveLatLng: `${receiveAddress.latitude},${receiveAddress.longitude}`,
                })}
              transparent
            >
              <Text>Next</Text>
            </Button>
          )
        }
      />
      <FixedContainer pad>
        {/* <Item > */}
        {/* <Icon name="compass" /> */}
        <Title style={styles.text}>Address Detail</Title>
        <Textarea
          // style={{marginBottom:12}}
          // placeholder="Address"
          rowSpan={5}
          bordered
          underline={false}
          value={receiveAddress.address}
          onChangeText={(address) => setReceiveAddress({ ...receiveAddress, address })}
        />
        <Title style={styles.text}>Address Coordinates</Title>
        <Subheading style={styles.text}>
          Please click on the map to confirm address coordinates.
        </Subheading>
        {/* </Item> */}
        {/* <Item picker>
          <Left
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon ios="ios-locate" name="locate" style={{ marginRight: 8 }} />
            <Text>District</Text>
          </Left>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            placeholder="Select district"
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            selectedValue={receiveAddress.district}
            onValueChange={(district) =>
              setReceiveAddress({ ...receiveAddress, district })}
          >
            {data.districts?.map((district) => (
              <Picker.Item
                key={district.districtId}
                label={district.name}
                value={district.districtId}
              />
            ))}
          </Picker>
        </Item> */}

        <MapView
          style={{ width: "100%", height: 350 }}
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
      </FixedContainer>
    </Container>
  );
}

export default Page;
