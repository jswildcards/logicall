import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  Button,
  Container,
  Icon,
  Input,
  Item,
  Left,
  Picker,
  Text,
} from "native-base";
import { useLazyQuery, useQuery } from "react-apollo";
import { StatusBar } from "react-native";
import { Actions } from "react-native-router-flux";
import FixedContainer from "../../components/FixedContainer";
import schema from "../../utils/schema";
import HeaderNav from "../../components/HeaderNav";

function Page() {
  const [search, setSearch] = useState({ address: "" });
  const [receiveAddress, setReceiveAddress] = useState({ address: "", county: "", latitude: null, longitude: null})

  // const { data, loading } = useQuery(schema.query.districts);
  const [getCoordinates, { data: lazyData }] = useLazyQuery(
    schema.query.coordinates
  );

  // if (loading) {
  //   return <Text>loading</Text>;
  // }

  return (
    <Container>
      <StatusBar />
      <HeaderNav
        title="New Address"
        subtitle="Create Order - Receiver"
        right={
          lazyData && (
            <Button onPress={() => Actions.profile()} transparent>
              <Text>Next</Text>
            </Button>
          )
        }
      />
      <FixedContainer pad>
        <Item>
          <Icon name="compass" />
          <Input
            placeholder="Address"
            value={search.address}
            onChangeText={(address) =>
              setSearch({ ...search, address })}
          />
        </Item>
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

        <Button
          block
          onPress={() =>
            getCoordinates({
              variables: {
                query: search.address,
                county: search.district,
              },
            })}
        >
          <Text>Search</Text>
        </Button>
        {lazyData?.coordinates && (
          <MapView
            style={{ width: "100%", height: 400 }}
            region={{
              latitude: lazyData.coordinates.latitude ?? 22.38131,
              longitude: lazyData.coordinates.longitude ?? 114.168639,
              latitudeDelta: lazyData.coordinates.latitude ? 0.0421 : 0.9,
              longitudeDelta: lazyData.coordinates.latitude ? 0.0421 : 0.9,
            }}
          >
            <Marker
              coordinate={{
                latitude: lazyData.coordinates.latitude,
                longitude: lazyData.coordinates.longitude,
              }}
            />
          </MapView>
        )}
      </FixedContainer>
    </Container>
  );
}

export default Page;
