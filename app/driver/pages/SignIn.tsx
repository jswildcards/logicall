import { useMutation } from "react-apollo";
import React, { useEffect, useState } from "react";
import { Actions } from "react-native-router-flux";
import { StatusBar, StyleSheet } from "react-native";
import {
  Container,
  Content,
  Item,
  Input,
  Icon,
  Form,
  Label,
  Button,
  Text,
  // View,
  Thumbnail,
  Toast,
  Body,
  CheckBox,
  ListItem,
  Picker,
} from "native-base";
import { ApolloError } from "apollo-boost";
import { Headline, Subheading } from "react-native-paper";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import schema from "../utils/schema";
import logo from "../assets/icon.png";
import FixedContainer from "../components/FixedContainer";

const styles = StyleSheet.create({
  buttonSignUp: {
    marginHorizontal: -16,
  },
  buttonTextSignUp: {
    textDecorationLine: "underline",
  },
  textSignUp: {
    marginTop: 14,
  },
  containerSignUp: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  iconCenter: {
    alignSelf: "center",
    marginVertical: 12,
  },
  headline: {
    textAlign: "center",
    marginBottom: -6,
    color: "#434343",
    // fontWeight: "bold",
    // paddingTop: 12
  },
  subheading: {
    textAlign: "center",
    // marginTop: -2,
    color: "#434343",
    fontSize: 14,
  },
});

function Page() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "driver",
  });
  const [testMode, setTestMode] = useState(false);
  const { getItem: globalUser, setItem: setGlobalUser } = useAsyncStorage(
    "driverUser"
  );
  const {
    getItem: globalTestMode,
    setItem: setGlobalTestMode,
  } = useAsyncStorage("testMode");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInCallBack = async () => {
    setLoading(false);
    setError("");
    await setGlobalUser(JSON.stringify(user));
    await setGlobalTestMode(JSON.stringify(testMode));
    Actions.home();
  };

  const signInErrorHandler = (err: ApolloError) => {
    setLoading(false);
    const msg = err.message;
    setError(msg);
    Toast.show({ text: msg, buttonText: "OK", type: "danger", duration: 6000 });
  };

  const [signIn] = useMutation(schema.mutation.signIn, {
    onCompleted: signInCallBack,
    onError: signInErrorHandler,
  });

  const readGlobalData = async () => {
    const { username, password } = JSON.parse(
      (await globalUser()) ?? '{"username":"","password":""}'
    );
    setUser({ ...user, username, password });
    setTestMode(((await globalTestMode()) ?? "false") === "true");
  };

  useEffect(() => {
    readGlobalData();
  }, []);

  return (
    <Container>
      <StatusBar />
      <Content>
        <FixedContainer pad>
          <Thumbnail square large style={styles.iconCenter} source={logo} />
          <Headline style={styles.headline}>LogiCall</Headline>
          <Subheading style={styles.subheading}>Driver</Subheading>
          <Form>
            <Item floatingLabel last>
              <Icon ios="ios-person" name="person" />
              <Label>Username</Label>
              <Input
                value={user.username}
                disabled={isLoading}
                onChangeText={(username) => setUser({ ...user, username })}
              />
            </Item>
            <Item floatingLabel last error={error.length > 0}>
              <Icon ios="ios-lock" name="lock" />
              <Label>Password</Label>
              <Input
                value={user.password}
                disabled={isLoading}
                secureTextEntry={!isPasswordVisible}
                onChangeText={(password) => setUser({ ...user, password })}
              />
              <Icon
                ios={isPasswordVisible ? "ios-eye-off" : "ios-eye"}
                name={isPasswordVisible ? "eye-off" : "eye"}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              />
            </Item>
            {/* <Button danger transparent>
            <Text>{error}</Text>
          </Button> */}
            <ListItem>
              <CheckBox
                checked={testMode}
                onPress={() => setTestMode(!testMode)}
              />
              <Body>
                <Text>Test Mode</Text>
              </Body>
            </ListItem>
            {testMode && (
              <Picker
                note
                mode="dropdown"
                style={{ width: 120 }}
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
              >
                <Picker.Item label="Wallet" value="key0" />
                <Picker.Item label="ATM Card" value="key1" />
                <Picker.Item label="Debit Card" value="key2" />
                <Picker.Item label="Credit Card" value="key3" />
                <Picker.Item label="Net Banking" value="key4" />
              </Picker>
            )}
            <Button
              style={styles.textSignUp}
              disabled={isLoading}
              block
              onPress={() => {
                setLoading(true);
                signIn({ variables: { input: { ...user } } });
              }}
            >
              <Text>Sign In</Text>
            </Button>
          </Form>
        </FixedContainer>
      </Content>
    </Container>
  );
}

export default Page;
