import moment from "moment-timezone";
import {
  Card,
  CardItem,
  Body,
  Button,
  Icon,
  Text,
  Container,
  Content,
  Badge,
  Left,
  ListItem,
  View,
  Fab,
  Right,
} from "native-base";
import React from "react";
import { StatusBar } from "react-native";
import { Actions } from "react-native-router-flux";
import AvatarItem from "../components/AvatarItem";
import FixedContainer from "../components/FixedContainer";
import HeaderNav from "../components/HeaderNav";
import { mapStatusToColor } from "../utils/convert";

export function JobDetail(props) {
  const { job } = props;
  const { order } = job;

  return (
    <Container>
      <StatusBar />
      <Content>
        <FixedContainer>
          <HeaderNav
            title="Job Detail"
            subtitle={`Order ${job.order.orderId}`}
          />
          <ListItem icon last itemDivider>
            <Left>
              <Icon
                name="information-circle-outline"
                ios="ios-information-circle-outline"
              />
            </Left>
            <Body>
              <Text>Basic Information</Text>
            </Body>
          </ListItem>

          <ListItem last>
            <Text>{order.orderId} </Text>
            <Badge style={mapStatusToColor(order.status)}>
              <Text style={mapStatusToColor(order.status)}>{order.status}</Text>
            </Badge>
          </ListItem>

          <AvatarItem includePhone item={order.sender} />
          <ListItem icon last noBorder>
            <Left>
              <Icon name="pin" ios="ios-pin" />
            </Left>
            <Body>
              <Text>{order.sendAddress}</Text>
            </Body>
          </ListItem>

          <View style={{ display: "flex", alignItems: "center" }}>
            <Icon name="arrow-down" ios="ios-arrow-down" />
          </View>

          <AvatarItem includePhone item={order.receiver} />
          <ListItem icon last noBorder>
            <Left>
              <Icon name="pin" ios="ios-pin" />
            </Left>
            <Body>
              <Text>{order.receiveAddress}</Text>
            </Body>
          </ListItem>

          <Button
            block
            onPress={() => Actions.map({ job })}
            style={{ margin: 8 }}
          >
            <Icon ios-name="ios-map" name="map" />
            <Text>Check the Map</Text>
          </Button>

          <ListItem icon last itemDivider>
            <Left>
              <Icon name="walk" ios="ios-walk" />
            </Left>
            <Body>
              <Text>Recent Activity</Text>
            </Body>
          </ListItem>

          {order.logs.map((log) => (
            <ListItem key={log.orderLogId} noIndent>
              <Body>
                <Text>{log.comments}</Text>
                <Text note>
                  {moment
                    .tz(Number(log.createdAt), "Asia/Hong_Kong")
                    .format("YYYY-MM-DD HH:mm")}
                </Text>
              </Body>
              <Right>
                <Badge
                  style={{
                    display: "flex",
                    width: 100,
                    ...mapStatusToColor(log.status),
                  }}
                >
                  <Text style={mapStatusToColor(log.status)}>{log.status}</Text>
                </Badge>
              </Right>
            </ListItem>
          ))}
        </FixedContainer>
      </Content>
    </Container>
  );
}

export default JobDetail;
