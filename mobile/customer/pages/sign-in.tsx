// app/ScarletScreen.js

import React, { useState } from "react";
import {
  // Button,
  StatusBar,
  StyleSheet,
  // Text,
  // TextInput,
  View,
} from "react-native";
import { Button, Icon, Input, Text } from "react-native-elements";
import { Actions } from "react-native-router-flux"; // New code
import server from "../util/server";

const styles = StyleSheet.create({
  root: {
    padding: 16,
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
  },
  button: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.54)",
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    textDecorationColor: "rgba(0, 0, 0, 0.54)",
  },
  buttonRed: {
    padding: 0,
  },
  divider: {
    marginVertical: 16,
  },
  containerSignUp: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
});

function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const navigate = (page: string) => Actions.replace(page);

  const signIn = async () => {
    await server.signIn({ username, password });
    Actions.home();
  };

  return (
    <View style={styles.root}>
      <StatusBar />
      <View>
        <Input
          label="Username"
          placeholder="BettyBar"
          leftIcon={{ type: "material-community", name: "account" }}
          value={username}
          onChangeText={(value) => setUsername(value)}
        />
        <Input
          label="Password"
          placeholder="•••••••••"
          leftIcon={{ type: "material-community", name: "lock" }}
          rightIcon={(
            <Icon
              type="material-community"
              name={isPasswordVisible ? "eye" : "eye-off"}
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            />
          )}
          value={password}
          secureTextEntry={!isPasswordVisible}
          onChangeText={(value) => setPassword(value)}
        />
        <Button buttonStyle={styles.button} title="Sign In" onPress={signIn} />
        <View style={styles.containerSignUp}>
          <Text>New to Here? </Text>
          <Button
            onPress={() => navigate("signUp")}
            buttonStyle={styles.buttonRed}
            titleStyle={styles.title}
            type="clear"
            title="Sign Up"
          />
          <Text>.</Text>
        </View>
      </View>
    </View>
  );
}

export default SignInPage;
