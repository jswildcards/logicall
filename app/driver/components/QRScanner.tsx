import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";

function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export class ExpoScanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      data: null,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  async onBarCodeRead({ data }) {
    await delay(500);
    if (this.state.data == data) return;
    this.setState({ data });
    return {data};
  }

  render() {
    const { hasCameraPermission } = this.state;
    const { onBarCodeRead } = this.props;

    if (hasCameraPermission === null) {
      return (
        <View style={styles.container}>
          <Text>Requesting for camera permission</Text>
        </View>
      );
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={({ data }) => {
            this.onBarCodeRead({ data }).then(onBarCodeRead);
          }}
          style={{ flex: 1 }}
        />
      </View>
    );
  }
}

export default ExpoScanner;

const styles = StyleSheet.create({
  container: {
    fontSize: 20,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
