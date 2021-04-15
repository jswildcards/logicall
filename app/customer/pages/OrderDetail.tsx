import moment from "moment-timezone";
import {
  Body,
  Button,
  Text,
  Container,
  Badge,
  ListItem,
  Icon,
  Content,
  Left,
  Right,
} from "native-base";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { StatusBar, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Dialog, Paragraph, Portal } from "react-native-paper";
import AvatarItem from "../components/AvatarItem";
import FixedContainer from "../components/FixedContainer";
import HeaderNav from "../components/HeaderNav";
import QRCodeComponent from "../components/QRCode";
import { mapStatusToColor } from "../utils/convert";
import schema from "../utils/schema";

export function OrderDetail(props) {
  const { order } = props;
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [qrDialogVisible, setQrDialogVisible] = useState(false);
  const { loading, error, data, refetch } = useQuery(schema.query.me);
  const [updateOrderStatus] = useMutation(schema.mutation.updateOrderStatus, {
    onCompleted: refetch,
  });

  if (loading) {
    return (
      <Container>
        <StatusBar />
        <Text>loading</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <StatusBar />
        <Text>error</Text>
      </Container>
    );
  }

  const canCancel =
    order.status === "Pending" &&
    Number(order.creator.userId) === Number(data.me.userId);

  const canShowQr =
    (order.status === "Collecting" &&
      Number(order.sender.userId) === Number(data.me.userId)) ||
    (order.status === "Delivering" &&
      Number(order.receiver.userId) === Number(data.me.userId));

  const cancelButton = () => {
    return (
      <>
        <ListItem last itemDivider icon>
          <Left>
            <Icon style={{ color: "red" }} name="alert" ios="ios-alert" />
          </Left>
          <Body>
            <Text style={{ color: "red" }}>Dangerous Action</Text>
          </Body>
        </ListItem>
        <Button
          danger
          block
          style={{ margin: 8 }}
          onPress={() => {
            setCancelDialogVisible(true);
          }}
        >
          <Text>Cancel Order</Text>
        </Button>
        <Portal>
          <Dialog
            visible={cancelDialogVisible}
            onDismiss={() => setCancelDialogVisible(false)}
          >
            <Dialog.Title>
              Are you sure to CANCEL the Order {order.orderId}
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                The order will not be processed anymore and this action{" "}
                <Text style={{ color: "red", fontWeight: "bold" }}>CANNOT</Text>{" "}
                be reverted.
              </Paragraph>
            </Dialog.Content>
            <Button
              danger
              block
              style={{ margin: 8, marginBottom: 0 }}
              onPress={() => {
                updateOrderStatus({
                  variables: {
                    input: {
                      orderId: order.orderId,
                      status: "Cancelled",
                      comments: `Cancelled by @${data.me.username}`,
                    },
                  },
                });
                setCancelDialogVisible(false);
              }}
            >
              <Text>Yes, Cancel the Order.</Text>
            </Button>
            <Button
              transparent
              light
              block
              style={{ margin: 8 }}
              onPress={() => setCancelDialogVisible(false)}
            >
              <Text>Decide Later.</Text>
            </Button>
          </Dialog>
        </Portal>
      </>
    );
  };

  const getOrderQRCodeData = () => {
    const isReceiver = Number(order.receiver.userId) === Number(data.me.userId);

    return {
      orderId: order.orderId,
      status: isReceiver ? "Delivered" : "Delivering",
      comments: `${isReceiver ? "Delivered to" : "Received from"} @${
        data.me.username
      } by`,
    };
  };

  const QrSection = () => (
    <>
      <ListItem icon last itemDivider>
        <Left>
          <Icon name="qr-scanner" ios="ios-qr-scanner" />
        </Left>
        <Body>
          <Text>QR Code</Text>
        </Body>
      </ListItem>
      <Text note style={{ paddingLeft: 16, paddingTop: 8 }}>
        Please show the QR Code to the driver to update order status.
      </Text>
      <TouchableOpacity
        style={{
          display: "flex",
          alignItems: "center",
          paddingVertical: 8,
        }}
        onPress={() => setQrDialogVisible(true)}
      >
        <QRCodeComponent data={getOrderQRCodeData()} />
        <Portal>
          <Dialog
            visible={qrDialogVisible}
            onDismiss={() => setQrDialogVisible(false)}
          >
            <Dialog.Title>QR Code</Dialog.Title>
            <Dialog.Content style={{ display: "flex", alignItems: "center" }}>
              <QRCodeComponent size={200} data={getOrderQRCodeData()} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setQrDialogVisible(false)}>
                <Text>Done</Text>
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </TouchableOpacity>
    </>
  );

  const durations = [
    order.estimatedDuration,
    order.jobs?.[0]?.duration ?? order.estimatedDuration,
  ];

  return (
    <Container>
      <StatusBar />
      <Content>
        <FixedContainer>
          <HeaderNav title="Order Detail" subtitle={`Order ${order.orderId}`} />
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

          <AvatarItem item={order.sender} />
          <ListItem icon last noBorder>
            <Left>
              <Icon name="pin" ios="ios-pin" />
            </Left>
            <Body>
              <Text>{order.sendAddress}</Text>
            </Body>
          </ListItem>

          {order.expectedCollectedTime && (
            <ListItem icon last noBorder>
              <Left>
                <Icon name="timer" ios="ios-timer" />
              </Left>
              <Body>
                <Text>
                  {moment
                    .tz(
                      Number(
                        order.logs.find((log) => log.status === "Collecting")
                          .createdAt
                      ) +
                        Number(order.expectedCollectedTime) * 1000,
                      "Asia/Hong_Kong"
                    )
                    .format("YYYY-MM-DD HH:mm")}
                </Text>
              </Body>
            </ListItem>
          )}

          <View style={{ display: "flex", alignItems: "center" }}>
            <Icon name="arrow-down" ios="ios-arrow-down" />
          </View>

          <AvatarItem item={order.receiver} />
          <ListItem icon last noBorder>
            <Left>
              <Icon name="pin" ios="ios-pin" />
            </Left>
            <Body>
              <Text>{order.receiveAddress}</Text>
            </Body>
          </ListItem>

          {order.expectedDeliveredTime && (
            <ListItem icon last noBorder>
              <Left>
                <Icon name="timer" ios="ios-timer" />
              </Left>
              <Body>
                <Text>
                  {moment
                    .tz(
                      Number(
                        order.logs.find((log) => log.status === "Collecting")
                          .createdAt
                      ) +
                        Number(order.expectedDeliveredTime) * 1000,
                      "Asia/Hong_Kong"
                    )
                    .format("YYYY-MM-DD HH:mm")}
                </Text>
              </Body>
            </ListItem>
          )}

          <ListItem icon last itemDivider>
            <Left>
              <Icon name="car" ios="ios-car" />
            </Left>
            <Body>
              <Text>Driver</Text>
            </Body>
          </ListItem>

          {order?.jobs?.[0]?.driver !== undefined && (
            <AvatarItem item={order.jobs[0].driver} includePhone />
          )}

          {order?.jobs?.[0]?.driver === undefined && (
            <ListItem icon last>
              <Left>
                <Icon style={{ color: "red" }} name="close" ios="ios-close" />
              </Left>
              <Body>
                <Text>No driver details yet.</Text>
              </Body>
            </ListItem>
          )}

          {canShowQr && QrSection()}

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

          {canCancel && cancelButton()}
        </FixedContainer>
      </Content>
    </Container>
  );
}

export default OrderDetail;
