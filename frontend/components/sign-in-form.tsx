import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Input,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControl,
  Button,
  CircularProgress
} from "@material-ui/core";
import {
  AccountBox,
  Lock,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";

const useStyles = makeStyles({
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

export default function SignInForm({ user, setUser }) {
  const [isVisible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const classes = useStyles();

  const handleClickShowPassword = () => {
    setVisible(!isVisible);
  };

  const signIn = async () => {
    setLoading(true);

    const userFetched = await fetch("/api/users/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());

    await new Promise(resolve => setTimeout(resolve, 1000));

    setUser(userFetched);
    setLoading(false);
  }

  const handleMouseDownPassword = handleClickShowPassword;

  return (
    <Box p="3rem">
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
                  onMouseDown={handleMouseDownPassword}
                >
                  {isVisible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )}
            value={password}
            type={isVisible ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
      </Box>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          disabled={isLoading}
          onClick={signIn}
        >
          Sign In
        </Button>
        {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
      {JSON.stringify(user)}
    </Box>
  )
}