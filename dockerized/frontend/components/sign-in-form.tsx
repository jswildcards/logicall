import React, { useState } from "react";
import styled from "styled-components";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import {
  Box,
  Input,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from "@material-ui/core";
import {
  AccountBox,
  Lock,
  Visibility,
  VisibilityOff,
  Close,
} from "@material-ui/icons";
// import { setUser as setUserAction } from "../actions";

const Wrapper = styled("div")({
  position: "relative",
});

const ButtonProgress = styled(CircularProgress)({
  position: "absolute",
  top: "50%",
  left: "50%",
  marginTop: -12,
  marginLeft: -12,
})

const BarContent = styled(SnackbarContent)({
  background: "#f44336",
})

const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput) {
    signIn(input: $input) {
      userId
      firstName
      lastName
      email
      role
      username
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export default function SignInForm() {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClickShowPassword = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const signIn = () => {
    // setLoading(true);

    // const userFetched = await fetch("/api/users/sign-in", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ username, password }),
    // }).then((res) => res.json()).catch(() => { setOpen(true); setLoading(false) });

    // setUser({ ...user });
    router.replace("/");
    // setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box pb="1rem">
        <FormControl fullWidth>
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input
            fullWidth
            disabled={isLoading}
            startAdornment={(
              <InputAdornment position="start">
                <AccountBox />
              </InputAdornment>
            )}
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
      </Box>
      <Box pb="1rem">
        <FormControl fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            disabled={isLoading}
            startAdornment={(
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            )}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleClickShowPassword}
                >
                  {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )}
            value={password}
            type={isPasswordVisible ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
      </Box>
      <Wrapper>
        <Mutation
          mutation={SIGN_IN_MUTATION}
          onCompleted={signIn}
          variables={{ input: { username, password } }}
        >
          {(mutation) => (
            <Button
              variant="contained"
              fullWidth
              color="primary"
              disabled={isLoading}
              onClick={() => {
                setLoading(true);
                return mutation();
              }}
            >
              Sign In
            </Button>
          )}
        </Mutation>
        {isLoading && (
          <ButtonProgress size={24} />
        )}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <BarContent
            message="Login Failed. Please Try Again."
            action={(
              <>
                <IconButton size="small" color="inherit" onClick={handleClose}>
                  <Close fontSize="small" />
                </IconButton>
              </>
            )}
          />
        </Snackbar>
      </Wrapper>
    </div>
  );
}
