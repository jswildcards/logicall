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
  Thumbnail,
  Toast,
  Body,
  CheckBox,
  ListItem,
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
  const [currentLocation, setCurrentLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [lastCurrentLocation, setLastCurrentLocation] = useState({
    latitude: "",
    longitude: "",
    use: false,
  });
  const { getItem: globalUser, setItem: setGlobalUser } = useAsyncStorage(
    "driverUser"
  );
  const {
    getItem: globalTestMode,
    setItem: setGlobalTestMode,
  } = useAsyncStorage("testMode");
  const {
    getItem: globalCurrentLocation,
    setItem: setGlobalCurrentLocation,
  } = useAsyncStorage("currentLocation");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const signInCallBack = async () => {
    setLoading(false);
    await setGlobalUser(JSON.stringify(user));
    if (testMode === true) {
      if (!currentLocation.latitude || !currentLocation.longitude) {
        const text =
          "You should enter all location information required for test mode!";
        Toast.show({
          text,
          buttonText: "OK",
          type: "danger",
          duration: 6000,
        });
        return;
      }
      await setGlobalCurrentLocation(JSON.stringify(currentLocation));
    }
    await setGlobalTestMode(JSON.stringify(testMode));
    Actions.home();
  };

  const signInErrorHandler = (err: ApolloError) => {
    setLoading(false);
    const text = err.message;
    Toast.show({ text, buttonText: "OK", type: "danger", duration: 6000 });
  };

  const [signIn] = useMutation(schema.mutation.signIn, {
    onCompleted: signInCallBack,
    onError: signInErrorHandler,
  });

  const readGlobalData = async () => {
    const { username, password } = JSON.parse(
      (await globalUser()) ?? '{"username":"","password":""}'
    );
    const { latitude, longitude } = JSON.parse(
      (await globalCurrentLocation()) ??
        '{"latitude":"","longitude":""}'
    );
    setUser({ ...user, username, password });
    setTestMode(((await globalTestMode()) ?? "false") === "true");
    setLastCurrentLocation({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      use: false,
    });
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
            <Item floatingLabel last>
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
              <>
                {lastCurrentLocation.latitude !== "" && (
                  <ListItem>
                    <CheckBox
                      checked={lastCurrentLocation.use}
                      onPress={async () => {
                        const { latitude, longitude } = JSON.parse(
                          (await globalCurrentLocation()) ??
                            '{"latitude":"","longitude":""}'
                        );
                        setCurrentLocation(
                          !lastCurrentLocation.use
                            ? lastCurrentLocation
                            : { latitude: "", longitude: "" }
                        );
                        setLastCurrentLocation({
                          latitude: latitude.toString(),
                          longitude: longitude.toString(),
                          use: !lastCurrentLocation.use,
                        });
                      }}
                    />
                    <Body>
                      <Text>Use Last Location</Text>
                    </Body>
                  </ListItem>
                )}
                <Form>
                  <Item floatingLabel last>
                    <Label>New current latitude</Label>
                    <Input
                      value={currentLocation.latitude ?? ""}
                      onChangeText={(latitude) => {
                        setLastCurrentLocation({
                          ...lastCurrentLocation,
                          use: false,
                        });
                        setCurrentLocation({ ...currentLocation, latitude });
                      }}
                    />
                  </Item>
                  <Item floatingLabel last>
                    <Label>New current longitude</Label>
                    <Input
                      value={currentLocation.longitude ?? ""}
                      onChangeText={(longitude) => {
                        setLastCurrentLocation({
                          ...lastCurrentLocation,
                          use: false,
                        });
                        setCurrentLocation({ ...currentLocation, longitude });
                      }}
                    />
                  </Item>
                </Form>
              </>
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
