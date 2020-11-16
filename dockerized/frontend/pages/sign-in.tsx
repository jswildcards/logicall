import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Hidden } from "@material-ui/core";
import SignInForm from "../components/sign-in-form";

const useStyles = makeStyles({
  root: {
    height: "100vh",
  },
  padding: {
    padding: 20,
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  back: {
    background: "#7e89fd",
  },
  front: {
    background: "white",
  },
});

export default function SignIn() {
  const classes = useStyles();

  return (
    <Grid
      container
      className={`${classes.root} ${classes.back}`}
    >
      <Hidden xsDown>
        <Grid item container sm={6} md={8} justify="center" alignItems="center">
          {/* <CardMedia
          component="img"
          alt=""
          image="/logicall-banner.png"
          className={classes.root}
        /> */}
          {/* <Box display={{ xs: 'none', md: 'block' }}> */}
          <img className={classes.image} src="/logicall-banner.png" alt="" />
          {/* </Box> */}
        </Grid>
      </Hidden>
      <Grid className={classes.front} item xs={12} sm={6} md={4}>
        <SignInForm />
      </Grid>
    </Grid>
  );
}