import { Mutation } from "react-apollo";
import React, { useState } from "react";
import { Actions } from "react-native-router-flux";
import { StatusBar, useWindowDimensions, StyleSheet } from "react-native";
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
  View,
} from "native-base";
import { ApolloError } from "apollo-boost";
import schema from "../utils/schema";
import { bp } from "../styles";
import BoxIcon from "../components/icons/BoxIcon";

const styles = StyleSheet.create({
  buttonSignUp: {
    marginHorizontal: -16,
  },
  buttonTextSignUp: {
    textDecorationLine: "underline",
  },
  textSignUp: {
    marginVertical: 14,
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
});

function Page() {
  const [user, setUser] = useState({
    username: "paniom",
    password: "Aa255300238",
    role: "customer",
  });
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const signInCallBack = () => {
    Actions.home();
  };

  return (
    <Container style={bp(useWindowDimensions()).root}>
      <StatusBar />
      <Content>
        <BoxIcon style={styles.iconCenter} height="50%" />
        <Form>
          <Item floatingLabel last>
            <Icon ios="ios-person" name="person" />
            <Label>Username</Label>
            <Input
              value={user.username}
              onChangeText={(username) => setUser({ ...user, username })}
            />
          </Item>
          <Item floatingLabel last error={error.length > 0}>
            <Icon ios="ios-lock" name="lock" />
            <Label>Password</Label>
            <Input
              value={user.password}
              secureTextEntry={!isPasswordVisible}
              onChangeText={(password) => setUser({ ...user, password })}
            />
            <Icon
              ios={isPasswordVisible ? "ios-eye-off" : "ios-eye"}
              name={isPasswordVisible ? "eye-off" : "eye"}
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            />
          </Item>
          <Button danger transparent>
            <Text>{error}</Text>
          </Button>
          <Mutation
            mutation={schema.mutation.signIn}
            onCompleted={signInCallBack}
            onError={(err: ApolloError) =>
              setError(err.message.replace("GraphQL error: ", ""))
            }
            variables={{ input: { ...user } }}
          >
            {(mutation) => (
              <Button block onPress={mutation}>
                <Text>Sign In</Text>
              </Button>
            )}
          </Mutation>

          <View style={styles.containerSignUp}>
            <Text style={styles.textSignUp}>New to Here? </Text>
            <Button
              onPress={() => Actions.signUp()}
              style={styles.buttonSignUp}
              transparent
              light
            >
              <Text style={styles.buttonTextSignUp}>Sign Up</Text>
            </Button>
            <Text style={styles.textSignUp}>.</Text>
          </View>
        </Form>
      </Content>
    </Container>
  );
}

export default Page;
