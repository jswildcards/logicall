import { Mutation } from "react-apollo";
import React, { useState } from "react";
import { Actions } from "react-native-router-flux";
import { StatusBar } from "react-native";
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
  const [username, setUsername] = useState("admin1");
  const [password, setPassword] = useState("password");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <Container>
      <StatusBar />
      <Content>
        <Form>
          <Item floatingLabel>
            <Icon ios="ios-person" name="person" />
            <Label>Username</Label>
            <Input
              value={username}
              onChangeText={(value) => setUsername(value)}
            />
          </Item>
          <Item floatingLabel>
            <Icon ios="ios-lock" name="lock" />
            <Label>Password</Label>
            <Input
              value={password}
              secureTextEntry={!isPasswordVisible}
              onChangeText={(value) => setPassword(value)}
            />
            <Icon
              ios={isPasswordVisible ? "ios-eye-off" : "ios-eye"}
              name={isPasswordVisible ? "eye-off" : "eye"}
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            />
          </Item>

          <Mutation
            mutation={schema.mutation.signUp}
            onCompleted={() => Actions.replace("home")}
            variables={{ input: { username, password } }}
          >
            {(mutation) => (
              <Button onPress={mutation}>
                <Text>Sign In</Text>
              </Button>
            )}
          </Mutation>
        </Form>
      </Content>
    </Container>
  );
}

export default SignInPage;
