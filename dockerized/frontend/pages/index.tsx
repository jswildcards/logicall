import {
  AppBar,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Toolbar,
  Typography,
  Box,
  makeStyles,
  Container,
  Breadcrumbs,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { styled } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useQuery, Mutation } from "react-apollo";
import { useRouter } from "next/router";
import { DataGrid } from "@material-ui/data-grid";
import schema from "../utils/schema"; // import SignInDetection from '../containers/sign-in-detection';

const IndexRoot = styled("div")({
  flexGrow: 1,
});

const Loading = styled(Grid)({
  height: "100vh",
});

const MenuButton = styled(IconButton)({
  marginRight: "2rem",
});

const Title = styled(Typography)({
  flexGrow: 1,
});
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
export default function Home() {
  const router = useRouter();
  // const [isSignedIn, setSignedIn] = useState(true);
  // const [isLoading, setLoading] = useState(true);
  const { loading, error, data } = useQuery(schema.query.me);
  const { data: orders } = useQuery(schema.query.orders);
  const classes = useStyles();
  // const [rows, setRows] = useState([
  //   {
  //     name: "Frozen yoghurt",
  //     calories: 159,
  //     fat: 6.0,
  //     carbs: 24,
  //     protein: 4.0,
  //   },
  //   {
  //     name: "Ice cream sandwich",
  //     calories: 237,
  //     fat: 9.0,
  //     carbs: 37,
  //     protein: 4.3,
  //   },
  //   { name: "Eclair", calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
  //   { name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
  //   { name: "Gingerbread", calories: 356, fat: 16.0, carbs: 49, protein: 3.9 },
  // ]);

  useEffect(() => {
    // if (!user || !Object.keys(user).length) {
    //   setSignedIn(false);
    //   router.push("sign-in");
    // }
    // setLoading(false);
  });

  const signOut = () => {
    router.replace("sign-in");
  };

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
    );
  }

  if (error) {
    router.replace("/sign-in");

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
    );
  }

  return (
    <IndexRoot>
      <AppBar position="static">
        <Toolbar>
          <MenuButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </MenuButton>
          <Title variant="h6">Dashboard</Title>
          <Mutation mutation={schema.mutation.signOut} onCompleted={signOut}>
            {(mutation) => (
              <Button color="inherit" onClick={mutation}>
                {data.me.username}
              </Button>
            )}
          </Mutation>
        </Toolbar>
      </AppBar>
      <Container>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="textPrimary">Home</Typography>
        </Breadcrumbs>
        <DataGrid
          rows={orders?.orders}
          columns={[{ field: "id", headerName: "ID" }]}
          checkboxSelection
        />
      </Container>
    </IndexRoot>
  );
}
