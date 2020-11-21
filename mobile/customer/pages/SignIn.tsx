import { Mutation } from "react-apollo";
import React, { useState } from "react";
import { Actions } from "react-native-router-flux";
import { StatusBar, useWindowDimensions } from "react-native";
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
} from "native-base";
import schema from "../utils/schema";

function SignInPage() {
  const [user, setUser] = useState({
    username: "admin1",
    password: "password",
  });
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const signInCallBack = () => {
    Actions.home();
  };

  return (
    <Container
      style={{
        width: useWindowDimensions().width > 400 ? 400 : "100%",
        alignSelf: "center",
      }}
    >
      <StatusBar />
      <Content>
        <Form>
          <Item floatingLabel last>
            <Icon ios="ios-person" name="person" />
            <Label>Username</Label>
            <Input
              value={user.username}
              onChangeText={(username) => setUser({ ...user, username })}
            />
          </Item>
          <Item floatingLabel last>
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

          <Mutation
            mutation={schema.mutation.signIn}
            onCompleted={signInCallBack}
            variables={{ input: { ...user } }}
          >
            {(mutation) => (
              <Button block onPress={mutation}>
                <Text>Sign In</Text>
              </Button>
            )}
          </Mutation>

          <Button onPress={() => Actions.signUp()}>
            <Text>Sign Up</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
}

export default SignInPage;
