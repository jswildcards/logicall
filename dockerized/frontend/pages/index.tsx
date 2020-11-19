import {
  AppBar,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Toolbar,
  Typography,
  Box,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { styled } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useQuery, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { useRouter } from "next/router";
// import SignInDetection from '../containers/sign-in-detection';

const IndexRoot = styled("div")({
  flexGrow: 1,
})

const Loading = styled(Grid)({
  height: "100vh",
})

const MenuButton = styled(IconButton)({
  marginRight: "2rem",
})

const Title = styled(Typography)({
  flexGrow: 1,
})

const ME_QUERY = gql`
  query Me {
    me {
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

const SIGN_OUT_MUTATION = gql`
  mutation SignOut {
    signOut
  }
`;

export default function Home() {
  const router = useRouter();
  // const [isSignedIn, setSignedIn] = useState(true);
  // const [isLoading, setLoading] = useState(true);
  const { loading, error, data } = useQuery(ME_QUERY);

  useEffect(() => {
    // if (!user || !Object.keys(user).length) {
    //   setSignedIn(false);
    //   router.push("sign-in");
    // }

    // setLoading(false);
  });

  const signOut = () => {
    router.replace("sign-in");
  }

  if (loading) {
    return (
      <Loading
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <CircularProgress />
        <Box my={1}>
          <Typography>Loading data...</Typography>
        </Box>
      </Loading>
    )
  }

  if (error) {
    router.replace("sign-in");

    return (
      <Loading
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <CircularProgress />
        <Box my={1}>
          <Typography>We are redirecting you to sign in page.</Typography>
        </Box>
      </Loading>
    )
  }

  return (
    <IndexRoot>
      <AppBar position="static">
        <Toolbar>
          <MenuButton
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <Menu />
          </MenuButton>
          <Title variant="h6">
            News
          </Title>
          <Mutation
            mutation={SIGN_OUT_MUTATION}
            onCompleted={signOut}
          >
            {(mutation) => (
              <Button color="inherit" onClick={mutation}>{data.me.username}</Button>
            )}
          </Mutation>
        </Toolbar>
      </AppBar>
    </IndexRoot>
  );
}
