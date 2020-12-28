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
import schema from "../../utils/schema";
import FixedContainer from "../../components/FixedContainer";
import HeaderNav from "../../components/HeaderNav";
import AddressItem from "../../components/AddressItem";

function Page(props) {
  const { loading, data, refetch, networkStatus } = useQuery(schema.query.me);
  const [sendAddress, setSendAddress] = useState(null);

  if (loading) {
    return <Text>loading</Text>;
  }

  return (
    <Container>
      <StatusBar />
      <HeaderNav
        title="Address"
        subtitle="Create Order - Sender"
        right={sendAddress && (
          <Button onPress={() => Actions.createOrder4Finish({ ...props, sendAddress })} transparent>
            <Text>Next</Text>
          </Button>
        )}
      />
      {/* <View style={}> */}

      {/* <List> */}
      {/* <Text>{JSON.stringify(sendAddress)}</Text> */}
      <FlatList
        data={data.me.addresses}
        ListHeaderComponent={(
          <ListItem itemDivider>
            <Text>Select an address</Text>
          </ListItem>
        )}
        renderItem={({ item }) => (
          <AddressItem
            button
            item={item}
            onPress={() => setSendAddress(item)}
            selected={item.addressId === sendAddress?.addressId}
            right={item.addressId === sendAddress?.addressId && (
              <Right>
                <Icon
                  style={{ paddingRight: 12 }}
                  ios="ios-checkmark"
                  name="checkmark"
                />
              </Right>
            )}
          />
        )}
        // ListFooterComponent={(
        //   <View>
        //     <ListItem itemDivider>
        //       <Text>Or send a delivery with a new address:</Text>
        //     </ListItem>
        //     <FixedContainer pad>
        //       <Button onPress={() => Actions.createOrder2aNewAddress({ receiver })} block><Text>New Address</Text></Button>
        //     </FixedContainer>
        //   </View>
        // )}
        refreshControl={(
          <RefreshControl
            onRefresh={refetch}
            refreshing={networkStatus === NetworkStatus.refetch}
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