// app/ScarletScreen.js

import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import server from "../util/server";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7e89fd",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
  },
});

const HomePage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    server.getUsers().then((data) => setUsers(data));
  });

  return (
    <View style={styles.container}>
      <StatusBar />
      <Text style={styles.welcome}>{JSON.stringify(users)}</Text>
    </View>
  );
};

export default HomePage;
