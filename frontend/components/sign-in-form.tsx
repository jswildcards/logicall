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
  CircularProgress, Snackbar, SnackbarContent
} from "@material-ui/core";
import {
  AccountBox,
  Lock,
  Visibility,
  VisibilityOff, Close
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
  snackbar: {
    background: "#f44336"
  }
});

export default function SignInForm({ setUser }) {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();

  const handleClickShowPassword = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const signIn = async () => {
    setLoading(true);

    const userFetched = await fetch("/api/users/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json()).catch(() => { setOpen(true); setLoading(false) });

    setUser(userFetched);
    setLoading(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

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
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <SnackbarContent
            classes={{ root: classes.snackbar }}
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
      </div>
    </Box>
  )
}