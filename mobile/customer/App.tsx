/* eslint-disable global-require */

import React, { useEffect } from "react";
import { Router, Scene } from "react-native-router-flux";
import { ApolloProvider } from "react-apollo";

import * as Font from "expo-font";

import { Ionicons } from "@expo/vector-icons";

import { StyleProvider } from "native-base";
import { StyleSheet } from "react-native";
import getTheme from "./native-base-theme/components";
import platform from "./native-base-theme/variables/platform";

import HomePage from "./pages/home/Home";
import ProfilePage from "./pages/Profile";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import CreateOrder1SelectReceiverPage from "./pages/home/create-order/1-SelectReceiver";
import HistoryPage from "./pages/History";
import Tab from "./components/Tab";

import { client } from "./utils/schema";

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: "ghostwhite",
  },
});

function App() {
  useEffect(() => {
    Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
  });

  return (
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
              key="signUp"
              component={SignUpPage}
              title="Sign Up"
              // hideNavBar
            />
            <Scene
              key="createOrder1SelectReceiver"
              component={CreateOrder1SelectReceiverPage}
              title="Create Order - Select Receiver"
              hideNavBar
              clone
            />
            <Scene
              key="tabbar"
              tabs
              hideNavBar
              tabBarStyle={styles.tabs}
              showLabel={false}
            >
              {/* <Scene
                key="history"
                icon={Tab}
                iconName="time"
                iosIconName="ios-time"
                component={HistoryPage}
                title="History"
                hideNavBar
              /> */}
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
  );
}

export default App;
