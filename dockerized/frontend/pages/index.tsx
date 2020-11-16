import { AppBar, Grid, Button, CircularProgress, IconButton, Toolbar, Typography, Box } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { connect } from "react-redux";
// import SignInDetection from '../containers/sign-in-detection';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  loading: {
    height: "100vh",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Home({ user }) {
  const classes = useStyles();
  const router = useRouter();
  const [isSignedIn, setSignedIn] = useState(true);
  const [isLoading] = useState(true);

  useEffect(() => {
    if (!user || !Object.keys(user).length) {
      setSignedIn(false);
      router.push("sign-in");
    }
  })

  return (
    <div className={classes.root}>
      {!isSignedIn && (
        <Grid container direction="column" className={classes.loading} justify="center" alignItems="center">
          <CircularProgress />
          <Box my={1}>
            <Typography>We are redirecting you to sign in page.</Typography>
          </Box>
        </Grid>
      )}
      {isSignedIn && isLoading && (
        <Grid container direction="column" className={classes.loading} justify="center" alignItems="center">
          <CircularProgress />
          <Box my={1}>
            <Typography>Loading data...</Typography>
          </Box>
        </Grid>
      )}
      {isSignedIn && !isLoading && (
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              News
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      )}
    </div>
  )
};

const mapStateTpProps = (state) => ({
  user: state.user,
});

export default connect(mapStateTpProps)(Home);
