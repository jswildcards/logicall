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
  Card,
  CardHeader,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useQuery, Mutation } from "react-apollo";
import { useRouter } from "next/router";
import schema from "../utils/schema";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  loading: {
    height: "100vh",
  },
  menuButton: {
    marginRight: "2rem",
  },
  title: {
    flexGrow: 1,
  },
  table: {
    minWidth: 650,
  },
});
export default function Home() {
  const router = useRouter();
  // const [isSignedIn, setSignedIn] = useState(true);
  // const [isLoading, setLoading] = useState(true);
  const { loading, error, data } = useQuery(schema.query.me);
  const styles = useStyles();
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
      <Grid
        className={styles.loading}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <CircularProgress />
        <Box my={1}>
          <Typography>Loading data...</Typography>
        </Box>
      </Grid>
    );
  }

  if (error) {
    router.replace("/sign-in");

    return (
      <Grid
        className={styles.loading}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <CircularProgress />
        <Box my={1}>
          <Typography>We are redirecting you to sign in page.</Typography>
        </Box>
      </Grid>
    );
  }

  return (
    <div className={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={styles.menuButton} edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography className={styles.title} variant="h6">Dashboard</Typography>
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
        <Card>
          <CardHeader />
        </Card>
      </Container>
    </div>
  );
}
