import React from "react";
import { Grid, Hidden, Box, makeStyles } from "@material-ui/core";
import SignInForm from "../components/sign-in-form";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    background: "#7e89fd",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  front: {
    background: "white",
  },
  signInRoot: {
    padding: "2rem",
  }
})

export default function SignIn() {
  // const router = useRouter();
  // useEffect(() => {
  //   if (user && Object.keys(user).length) {
  //     router.push("/");
  //   }
  // })
  const styles = useStyles();

  return (
    <Grid className={styles.root} container>
      <Hidden xsDown>
        <Grid
          item
          container
          sm={6}
          md={8}
          direction="column"
          justify="center"
          alignItems="center"
        >
          {/* <CardMedia
          component="img"
          alt=""
          image="/logicall-banner.png"
          className={classes.root}
        /> */}
          {/* <Box display={{ xs: 'none', md: 'block' }}> */}
          <img className={styles.image} src="/logicall-banner.png" alt="" />
          {/* </Box> */}
        </Grid>
      </Hidden>
      <Grid className={styles.front} item xs={12} sm={6} md={4}>
        <img
          className={styles.image}
          width="30%"
          style={{ paddingTop: "2rem", display: "block", margin: "auto" }}
          src="/box.svg"
          alt=""
        />
        <Box className={styles.signInRoot}>
          <SignInForm />
        </Box>
      </Grid>
    </Grid>
  );
}
