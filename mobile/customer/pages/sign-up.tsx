// app/ScarletScreen.js

import React, { useState } from 'react';
import {
  // Button,
  StatusBar,
  StyleSheet,
  // Text,
  // TextInput,
  View
} from 'react-native';
import { Button, Icon, Input, Text } from 'react-native-elements';
import { Actions } from 'react-native-router-flux'; // New code

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
    textDecorationColor: "rgba(0, 0, 0, 0.54)"
  },
  buttonRed: {
    padding: 0
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
    paddingVertical: 16
  }
});

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("customer");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const navigate = (page: string) => Actions.replace(page);

  const signUp = async () => {
    setLoading(true);

    await fetch("http://192.168.56.1/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        email,
        role
      })
    });

    Actions.home();
  }

  return (
    <View style={styles.root}>
      <StatusBar />
      <View>
        <Input label="Email" placeholder="bettybar@example.com" leftIcon={{ type: 'material-community', name: 'email' }} value={email} onChangeText={(value) => setEmail(value)} />
        <Input label="Username" placeholder="BettyBar" leftIcon={{ type: 'material-community', name: 'account' }} value={username} onChangeText={(value) => setUsername(value)} />
        <Input label="Password" placeholder="•••••••••" leftIcon={{ type: 'material-community', name: 'lock' }} rightIcon={<Icon type="material-community" name={isPasswordVisible ? "eye" : "eye-off"} onPress={() => setPasswordVisible(!isPasswordVisible)} />} value={password} secureTextEntry={!isPasswordVisible} onChangeText={(value) => setPassword(value)} />
        <Input label="Confirm Password" placeholder="•••••••••" leftIcon={{ type: 'material-community', name: 'lock-question' }} rightIcon={<Icon type="material-community" name={isConfirmPasswordVisible ? "eye" : "eye-off"} onPress={() => setConfirmPasswordVisible(!isPasswordVisible)} />} value={confirmPassword} secureTextEntry={!isPasswordVisible} onChangeText={(value) => setConfirmPassword(value)} />
        <Button loading={isLoading} buttonStyle={styles.button} title="Sign Up" onPress={signUp} />
        <View style={styles.containerSignUp}>
          <Text>Already have an account? </Text>
          <Button onPress={() => navigate("signIn")} buttonStyle={styles.buttonRed} titleStyle={styles.title} type="clear" title="Sign In" />
          <Text>.</Text>
        </View>
      </View>
    </View>
  );
}

export default SignUpPage;