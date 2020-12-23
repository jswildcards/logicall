import { Icon, View, Text } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    width: 48,
  },
});

export default function Tab(props) {
  const { focused, title, iconName, iosIconName } = props;
  const color = focused ? "#536DFE" : "#888888";

  return (
    <View style={styles.root}>
      <Icon style={{ color }} ios={iosIconName} name={iconName} size={18} />
      <Text style={{ color, fontSize: 12 }}>{title}</Text>
    </View>
  );
}
