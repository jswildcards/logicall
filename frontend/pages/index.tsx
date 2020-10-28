import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, CardMedia, } from "@material-ui/core";
import User from "../components/User";

const useStyles = makeStyles({
  root: {
    height: "100vh",
  },
  padding: {
    padding: 20,
  },
});

export default function Home() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={8} className={classes.root}>
        <CardMedia
          component="img"
          alt=""
          image="/logistics.svg"
          className={classes.root}
        />
      </Grid>
      <Grid item xs={4}>
        <User />
      </Grid>
    </Grid>
  );
}
