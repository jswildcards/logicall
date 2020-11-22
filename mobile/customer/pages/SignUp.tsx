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
  Col,
  Grid,
} from "native-base";
import { ApolloError } from "apollo-boost";
import schema from "../utils/schema";
import { bp } from "../styles";

function Page() {
  const [user, setUser] = useState({
    firstName: "Tin Lok",
    lastName: "Law",
    username: "paniom",
    email: "tinloklaw@example.com",
    password: "Aa255300238",
    role: "customer",
  });
  const [confirmPassword, setConfirmPassword] = useState("Aa255300238");
  const [error, setError] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState([false, false]);

  return (
    <Container style={bp(useWindowDimensions()).root}>
      <StatusBar />
      <Content>
        <Form>
          <Grid>
            <Col>
              <Item floatingLabel last>
                <Label>First Name</Label>
                <Input
                  value={user.firstName}
                  onChangeText={(firstName) => setUser({ ...user, firstName })}
                />
              </Item>
            </Col>
            <Col>
              <Item floatingLabel>
                <Label>Last Name</Label>
                <Input
                  value={user.lastName}
                  onChangeText={(lastName) => setUser({ ...user, lastName })}
                />
              </Item>
            </Col>
          </Grid>
          <Item floatingLabel last>
            <Label>Username</Label>
            <Input
              value={user.username}
              onChangeText={(username) => setUser({ ...user, username })}
            />
          </Item>
          <Item floatingLabel last>
            <Label>Email</Label>
            <Input
              value={user.email}
              onChangeText={(email) => setUser({ ...user, email })}
            />
          </Item>
          <Item floatingLabel last>
            <Label>Password</Label>
            <Input
              secureTextEntry={!isPasswordVisible[0]}
              value={user.password}
              onChangeText={(password) => setUser({ ...user, password })}
            />
            <Icon
              ios={isPasswordVisible[0] ? "ios-eye-off" : "ios-eye"}
              name={isPasswordVisible[0] ? "eye-off" : "eye"}
              onPress={() => {
                const [p, c] = isPasswordVisible;
                setPasswordVisible([!p, c]);
              }}
            />
          </Item>
          <Item floatingLabel last>
            <Label>Confirm Password</Label>
            <Input
              secureTextEntry={!isPasswordVisible[1]}
              value={confirmPassword}
              onChangeText={(data) => setConfirmPassword(data)}
            />
            <Icon
              ios={isPasswordVisible[1] ? "ios-eye-off" : "ios-eye"}
              name={isPasswordVisible[1] ? "eye-off" : "eye"}
              onPress={() => {
                const [p, c] = isPasswordVisible;
                setPasswordVisible([p, !c]);
              }}
            />
          </Item>
          <Button danger transparent>
            <Text>{error}</Text>
          </Button>

          <Mutation
            mutation={schema.mutation.signUp}
            onCompleted={() => Actions.home()}
            onError={(err: ApolloError) =>
              setError(err.message.replace("GraphQL error: ", ""))
            }
            variables={{ input: { ...user } }}
          >
            {(mutation) => (
              <Button block onPress={mutation}>
                <Text>Sign Up</Text>
              </Button>
            )}
          </Mutation>
        </Form>
      </Content>
    </Container>
  );
}

export default Page;
