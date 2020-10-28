import React, { useState } from "react";
import {
  Box,
  Input,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControl,
  Button,
} from "@material-ui/core";
import {
  AccountBox,
  Lock,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";

export default function User() {
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClickShowPassword = () => {
    setVisible(!visible);
  };

  const handleMouseDownPassword = handleClickShowPassword;
  return (
    <>
      <Box p="1rem">
        <Box pb="1rem">
          <FormControl fullWidth>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
              fullWidth
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
                    {visible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )}
              value={password}
              type={visible ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </Box>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          disableElevation
        >
          Sign In
        </Button>
      </Box>
    </>
  )
}