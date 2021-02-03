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
  const { getItem: getStoredUser, setItem: setStoredUser } = useAsyncStorage(
    "driverUser"
  );
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInCallBack = async () => {
    setLoading(false);
    setError("");
    await setStoredUser(JSON.stringify(user));
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

  const readUserFromStorage = async () => {
    const { username, password } = JSON.parse(
      (await getStoredUser()) ?? '{"username":"","password":""}'
    );
    setUser({ ...user, username, password });
  };

  useEffect(() => {
    readUserFromStorage();
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
