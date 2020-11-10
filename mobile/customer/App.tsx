// app/index.js

import React from "react";
import { Router, Scene } from "react-native-router-flux";

import HomePage from "./pages/home";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";

const App = () => {
  return (
    <Router>
      <Scene key="root">
        <Scene key="signIn" component={SignInPage} title="Sign In" hideNavBar />
        <Scene key="signUp" component={SignUpPage} title="Sign Up" hideNavBar />
        <Scene key="tabbar" tabs hideNavBar>
          <Scene key="home" component={HomePage} title="home" hideNavBar />
        </Scene>
      </Scene>
    </Router>
  );
};

export default App;
