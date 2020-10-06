// import '../styles/globals.css'
import React from "react";
import "fontsource-roboto";

// Redux: add reducers
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducers from "../reducers";

const store = createStore(rootReducers);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
