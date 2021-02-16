/* eslint-disable global-require */

import React, { useEffect, useState } from "react";
import { Router, Scene } from "react-native-router-flux";
import { ApolloProvider } from "react-apollo";

import * as Font from "expo-font";

import { Ionicons } from "@expo/vector-icons";

import { StyleProvider, View, Text, Root } from "native-base";
import { StyleSheet } from "react-native";
import Roboto from "native-base/Fonts/Roboto.ttf";
import RobotoMedium from "native-base/Fonts/Roboto_medium.ttf";
import getTheme from "./native-base-theme/components";
import platform from "./native-base-theme/variables/platform";

import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import SignInPage from "./pages/SignIn";
import MapPage from "./pages/Map";
import ScannerPage from "./pages/Scanner";
import ScannResultPage from "./pages/ScanResult";
import JobRequestPage from "./pages/JobRequest";
import Tab from "./components/Tab";

import { client } from "./utils/schema";

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: "ghostwhite",
  },
});

function App() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    Font.loadAsync({
      Roboto,
      Roboto_medium: RobotoMedium,
      ...Ionicons.font,
    }).then(() => setLoading(false));
  });

  if (isLoading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <Root>
      <ApolloProvider client={client}>
        <StyleProvider style={getTheme(platform)}>
          <Router>
            <Scene key="root">
              <Scene
                key="signIn"
                component={SignInPage}
                title="Sign In"
                hideNavBar
              />
              <Scene
                key="map"
                component={MapPage}
                title="Map"
                hideNavBar
              />
              <Scene
                key="scanResult"
                component={ScannResultPage}
                title="Scan Result"
                hideNavBar
              />
              <Scene
                key="tabbar"
                tabs
                hideNavBar
                tabBarStyle={styles.tabs}
                showLabel={false}
              >
                <Scene
                  key="scanner"
                  icon={Tab}
                  iconName="camera"
                  iosIconName="ios-camera"
                  component={ScannerPage}
                  title="Scanner"
                  hideNavBar
                />
                <Scene
                  key="jobRequest"
                  icon={Tab}
                  iconName="download"
                  iosIconName="ios-download"
                  component={JobRequestPage}
                  title="Job Request"
                  hideNavBar
                />
                <Scene
                  key="home"
                  icon={Tab}
                  iconName="home"
                  iosIconName="ios-home"
                  component={HomePage}
                  title="Home"
                  hideNavBar
                />
                <Scene
                  key="profile"
                  icon={Tab}
                  iconName="person"
                  iosIconName="ios-person"
                  component={ProfilePage}
                  title="Profile"
                  hideNavBar
                />
              </Scene>
            </Scene>
          </Router>
        </StyleProvider>
      </ApolloProvider>
    </Root>
  );
}

export default App;
