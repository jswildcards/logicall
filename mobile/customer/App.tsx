// app/index.js

import React, { useEffect } from "react";
import { Router, Scene } from "react-native-router-flux";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import Constants from "expo-constants";
import * as Font from "expo-font";

import { Ionicons } from "@expo/vector-icons";

import { StyleProvider } from "native-base";
import { StyleSheet } from "react-native";
import getTheme from "./native-base-theme/components";
import material from "./native-base-theme/variables/material";

import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import CreateOrderPage from "./pages/CreateOrder";
import HistoryPage from "./pages/History";

import Tab from "./components/Tab";

const httpLink = createHttpLink(
  { uri: `http://${Constants.manifest.extra.host || "192.168.56.1"}/graphql` }
  // { uri, credentials: 'include' }
);

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: "ghostwhite",
  },
});

const App = () => {
  useEffect(() => {
    Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
  });

  return (
    <ApolloProvider client={client}>
      <StyleProvider style={getTheme(material)}>
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
              hideNavBar
            />
            <Scene
              key="createOrder"
              component={CreateOrderPage}
              title="Create Order"
              clone
            />
            <Scene
              key="tabbar"
              tabs
              hideNavBar
              tabBarStyle={styles.tabs}
              showLabel={false}
            >
              <Scene
                key="home"
                icon={Tab}
                iconName="home"
                iosIconName="ios-home"
                component={HomePage}
                title="home"
                hideNavBar
              />
              <Scene
                key="history"
                icon={Tab}
                iconName="time"
                iosIconName="ios-time"
                component={HistoryPage}
                title="clock"
                hideNavBar
              />
              <Scene
                key="profile"
                icon={Tab}
                iconName="person"
                iosIconName="ios-person"
                component={ProfilePage}
                title="profile"
                hideNavBar
              />
            </Scene>
          </Scene>
        </Router>
      </StyleProvider>
    </ApolloProvider>
  );
};

export default App;
