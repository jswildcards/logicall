import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import {
  Container,
  Grid,
  Text,
  Button,
  Col,
  Row,
  H1,
  H3,
  // Body,
  View,
} from "native-base";
import { useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import EmptyIcon from "../../components/icons/EmptyIcon";
import schema from "../../utils/schema";

const styles = StyleSheet.create({
  col: {
    flex: 1,
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  header: {
    marginTop: 8,
    color: "#536DFE",
  },
  bold: {
    fontWeight: "bold",
  },
});

function Page() {
  const { loading, error, data } = useQuery(schema.query.me);

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

  if (!data.me.receiveOrders?.length) {
    return (
      <Container>
        <StatusBar />
        <Grid>
          <Col contentContainerStyle={styles.col}>
            <Row style={styles.row}>
              <EmptyIcon height="30%" />
              <H3 style={{ ...styles.header, ...styles.bold }}>
                No Orders Here!
              </H3>
              <Text style={styles.header}>Do you want to create an order now?</Text>
              <View styles={styles.body}>
                <Button
                  onPress={() => Actions.createOrder1SelectReceiver()}
                  style={styles.header}
                >
                  <Text>Create Order</Text>
                </Button>
              </View>
            </Row>
          </Col>
        </Grid>
      </Container>
    );
  }
  return (
    <Container>
      <StatusBar />
      <Text>Not Implemented Yet</Text>
    </Container>
  );
}

export default Page;
