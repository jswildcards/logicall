import { StyleSheet } from "react-native";

export function bp(window) {
  return StyleSheet.create({
    root: {
      width: window.width > 600 ? 600 : "100%",
      // flex: 1,
      alignSelf: "center",
      paddingHorizontal: 12,
    },
  });
}

export default { bp };
