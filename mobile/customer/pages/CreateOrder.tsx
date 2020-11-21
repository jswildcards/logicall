// app/ScarletScreen.js

import React from "react";
import { StatusBar, StyleSheet, useWindowDimensions } from "react-native";
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
import EmptyIcon from "../components/icons/EmptyIcon";
import schema from "../utils/schema";

const styles = StyleSheet.create({
  col: {
    // flex: 1,
  },
  row: {
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
  },
  body: {
    // alignSelf: "center",
    // flexDirection: "row",
    // justifyContent: "center",
  },
  header: {
    marginTop: 12,
    // color: "#536DFE",
  },
  bold: {
    fontWeight: "bold",
  },
});

const HomePage = () => {
  return (
    <Container
      style={{
        width: useWindowDimensions().width > 400 ? 400 : "100%",
        alignSelf: "center",
        padding: 12,
      }}
    >
      <StatusBar />
      <Grid>
        <Col contentContainerStyle={styles.col}>
          <Row style={styles.row}>
            <H3 style={styles.bold}>First, Select a receiver...</H3>
          </Row>
        </Col>
      </Grid>
    </Container>
  );
};

export default HomePage;
