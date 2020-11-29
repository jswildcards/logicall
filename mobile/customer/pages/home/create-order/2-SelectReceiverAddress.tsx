// app/ScarletScreen.js

import React, { useState } from "react";
import { StatusBar, RefreshControl, FlatList } from "react-native";
import {
  Container,
  Text,
  Button,
  Body,
  View,
  Item,
  Icon,
  Subtitle,
  Input,
  Header,
  Left,
  Title,
  Right,
  ListItem,
  Picker,
} from "native-base";
import { useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import { NetworkStatus } from "apollo-boost";
import MapView from "react-native-maps";
import schema from "../../../utils/schema";
import FixedContainer from "../../../components/FixedContainer";

function Page(props) {
  // const [receiver, setReceiver] = useState("");

  const { addresses, districts } = {
    addresses: useQuery(schema.query.addresses, {
      variables: { userId: parseInt(props.receiver.userId) },
    }),
    districts: useQuery(schema.query.districts),
  };

  // const { loading, data, refetch, networkStatus } = useQuery(
  //   schema.query.addresses,
  //   { variables: { userId: parseInt(props.receiver.userId) } }
  // );

  // const { loading: districtLoading, data: districtsData } = useQuery(
  //   schema.query.districts
  // );

  const [receiveAddress, setReceiveAddress] = useState(null);
  const [rawReceiveAddress, setRawReceiveAddress] = useState({
    userId: parseInt(props.receiver.userId),
    address: "",
    district: "",
    latitude: 0,
    longitude: 0,
  });

  if (addresses.loading || districts.loading) {
    return <Text>loading</Text>;
  }

  return (
    <Container>
      <StatusBar />
      <Header>
        <Left>
          <Button onPress={() => Actions.pop()} transparent>
            {/* <Icon ios="ios-arrow-back" name="arrow-back" /> */}
            <Text>Back</Text>
          </Button>
        </Left>
        <Body>
          <Title>Receiver Address</Title>
          <Subtitle>Create Order</Subtitle>
        </Body>
        <Right>
          <Button onPress={() => Actions.profile()} transparent>
            <Text>Next</Text>
          </Button>
        </Right>
      </Header>
      {/* <View style={}> */}

      {/* <List> */}
      <FlatList
        data={addresses.data.addresses}
        ListHeaderComponent={(
          <ListItem itemDivider>
            <Text>Select a address</Text>
          </ListItem>
        )}
        renderItem={({ item }) => (
          <ListItem
            avatar
            button
            onPress={() => setReceiveAddress(item)}
            selected={item.addressId === receiveAddress?.addressId}
          >
            <Left>
              <Icon ios="ios-navigate" name="navigate" />
            </Left>
            <Body>
              <Text>{item.address}</Text>
              <Text note>
                {`${item.district} (${item.latitude}, ${item.longitude})`}
              </Text>
            </Body>
            {item.addressId === receiveAddress?.addressId && (
              <Right>
                <Icon
                  style={{ paddingRight: 12 }}
                  ios="ios-checkmark"
                  name="checkmark"
                />
              </Right>
            )}
          </ListItem>
        )}
        ListFooterComponent={(
          <View>
            <ListItem itemDivider>
              <Text>Or send a delivery with a new address:</Text>
            </ListItem>
            <FixedContainer pad>
              <Item>
                <Icon name="compass" />
                <Input
                  placeholder="Address"
                  value={rawReceiveAddress.address}
                  onChangeText={(address) =>
                    setRawReceiveAddress({ ...rawReceiveAddress, address })}
                />
              </Item>
              <Item picker>
                <Left
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    ios="ios-locate"
                    name="locate"
                    style={{ marginRight: 8 }}
                  />
                  <Text>District</Text>
                </Left>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  placeholder="Select district"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={rawReceiveAddress.district}
                  onValueChange={(district) =>
                    setRawReceiveAddress({ ...rawReceiveAddress, district })}
                >
                  {districts.data.districts?.map((district) => (
                    <Picker.Item
                      key={district.districtId}
                      label={district.name}
                      value={district.districtId}
                    />
                  ))}
                </Picker>
              </Item>
              <MapView style={{ width: "100%", height: 400 }} />
            </FixedContainer>
          </View>
        )}
        refreshControl={(
          <RefreshControl
            onRefresh={addresses.refetch}
            refreshing={addresses.networkStatus === NetworkStatus.refetch}
          />
        )}
        keyExtractor={({ addressId }) => addressId}
      />
      {/* </List> */}

      {/* <SectionList
        style={{ ...styles.header, ...bp.root }}
        ListHeaderComponent={(
          <>
          <H3 style={styles.bold}>First, Select a receiver...</H3>
          <Item floatingLabel last>
          <Input
          placeholder="search receivers..."
          // value={receiver}
                onChangeText={(receiver) => { renderList(receiver); }}
              />
            </Item>
          </>
        )}
        sections={listItem}
        renderItem={({ item }) => <Text style={styles.item}>{item.value}</Text>}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        keyExtractor={(item) => item.key}
      /> */}
      {/* </View> */}
    </Container>
  );
}

export default Page;
