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
    <div>
      <style jsx global>
        {`
          body {
            margin: 0;
          }
        `}
      </style>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </div>
  );
}

export default MyApp;
