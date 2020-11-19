import React from "react";
import { styled } from "@material-ui/core/styles";
import { Grid, Hidden, Box } from "@material-ui/core";
import SignInForm from "../components/sign-in-form";

const Root = styled(Grid)({
  height: "100vh",
  background: "#7e89fd",
})

const Image = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
})

const Front = styled(Grid)({
  background: "white",
})

const SignInRoot = styled(Box)({
  padding: "2rem"
})

export default function SignIn() {
  // const router = useRouter();
  // useEffect(() => {
  //   if (user && Object.keys(user).length) {
  //     router.push("/");
  //   }
  // })

  return (
    <div>
      <Root container>
        <Hidden xsDown>
          <Grid item container sm={6} md={8} justify="center" alignItems="center">
            {/* <CardMedia
          component="img"
          alt=""
          image="/logicall-banner.png"
          className={classes.root}
        /> */}
            {/* <Box display={{ xs: 'none', md: 'block' }}> */}
            <Image src="/logicall-banner.png" alt="" />
            {/* </Box> */}
          </Grid>
        </Hidden>
        <Front item xs={12} sm={6} md={4}>
          <SignInRoot>
            <SignInForm />
          </SignInRoot>
        </Front>
      </Root>
    </div>
  );
}
