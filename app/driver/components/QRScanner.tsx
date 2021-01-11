import React, { Component } from "react";
import { Alert, View, Text, Vibration, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { Actions } from "react-native-router-flux";

export class ExpoScanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const { hasCameraPermission } = this.state;

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
          onBarCodeScanned={this.props.onBarCodeRead}
          style={{ flex: 1 }}
        />
      </View>
    );
  }
}

export default ExpoScanner;

const styles = StyleSheet.create({
  contsiner: {
    fontSize: 20,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
