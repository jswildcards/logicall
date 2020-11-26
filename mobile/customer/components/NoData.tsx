import React from "react";
import { StyleSheet } from "react-native";
import { Col, Grid, H3, Row, View, Text } from "native-base";

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

function NoData(props) {
  const { icon, title, subtitle, button } = props;

  return (
    <Grid>
      <Col contentContainerStyle={styles.col}>
        <Row style={styles.row}>
          {icon}
          <H3 style={{ ...styles.header, ...styles.bold }}>{title}</H3>
          <Text style={styles.header}>{subtitle}</Text>
          <View style={{ ...styles.body, ...styles.header }}>
            {button}
          </View>
        </Row>
      </Col>
    </Grid>
  );
}

export default NoData;
