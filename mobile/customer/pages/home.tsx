// app/ScarletScreen.js

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7e89fd',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },
});

const HomePage = () => {
  return (
    <View style={styles.container}>
      <StatusBar />
      <Text
        style={styles.welcome}
      >
        LogiCall
      </Text>
    </View>
  );
}

export default HomePage;