import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { useRouter } from "next/router";
import {
  Alert,
  AlertIcon,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import {
  MdAccountBox,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import schema from "../utils/schema";

export default function SignInForm() {
  const router = useRouter();
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "admin",
  });
  const [signIn] = useMutation(schema.mutation.signIn, {
    onCompleted: () => router.replace("/"),
    onError: (err) => {
      setError(err.message);
      setLoading(false);
    },
  });
  const trySignIn = () => {
    setLoading(true);
    signIn({ variables: { input: { ...user } } });
  };

  return (
    <Stack spacing={4}>
      {error && (
        <Alert borderRadius="md" status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={MdAccountBox} color="gray.300" />
        </InputLeftElement>
        <Input
          disabled={isLoading}
          placeholder="Username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") trySignIn();
          }}
        />
      </InputGroup>

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={MdLock} color="gray.300" />
        </InputLeftElement>
        <Input
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") trySignIn();
          }}
          disabled={isLoading}
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Password"
          value={user.password}
        />
        <InputRightElement>
          <Button
            variant="ghost"
            onClick={() => setPasswordVisibility(!isPasswordVisible)}
          >
            <Icon as={isPasswordVisible ? MdVisibility : MdVisibilityOff} />
          </Button>
        </InputRightElement>
      </InputGroup>

      <Button
        w="100%"
        colorScheme="blue"
        isLoading={isLoading}
        onClick={() => trySignIn()}
      >
        Sign In
      </Button>
    </Stack>
  );
}
