import React from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  padding: {
    paddingHorizontal: 12
  }
});

function FixedContainer(props) {
  return (
    <View style={{ ...styles.root, ...(props.pad ? styles.padding : {})}}>
      {props.children}
    </View>
  )
}

export default FixedContainer;
