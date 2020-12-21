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
  Card,
  CardContent,
  ListItemText,
  CardActions,
  Divider,
  Modal,
} from "@material-ui/core";
import { Container } from "@chakra-ui/react"
import { ArrowForward, Menu } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
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
  paddingVertical: {
    padding: "12px 0",
  },
  end: {
    textAlign: "end",
  },
  marginLeft: {
    marginLeft: "auto",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paddingAll: {
    padding: 12,
  },
});
export default function Home() {
  const router = useRouter();
  // const [isSignedIn, setSignedIn] = useState(true);
  // const [isLoading, setLoading] = useState(true);
  const { loading, error, data } = useQuery(schema.query.me);
  const { data: orders, refetch } = useQuery(schema.query.orders);
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [orderActions, setOrderActions] = useState({
    orderId: null,
    action: null,
    status: null,
  });
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

  const signOut = () => router.replace("sign-in");
  const handleModal = (state: boolean) => setOpen(state);

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
          <IconButton
            className={styles.menuButton}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <Menu />
          </IconButton>
          <Typography className={styles.title} variant="h6">
            Dashboard
          </Typography>
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
        <Typography className={styles.paddingVertical} variant="h5">
          Incoming Orders
        </Typography>
        {orders?.orders?.map((order) => (
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {order.orderId}
              </Typography>
              <Typography
                color={order.status === "Rejected" ? "secondary" : "primary"}
                gutterBottom
              >
                {order.status}
              </Typography>
              <Grid container alignItems="center">
                <Grid item xs={5}>
                  <ListItemText
                    primary={order.senderAddress.address}
                    secondary={`@${order.sender.username}`}
                  />
                </Grid>
                <Grid item xs={2} container justify="center">
                  <ArrowForward />
                </Grid>
                <Grid item xs={5}>
                  <ListItemText
                    className={styles.end}
                    primary={order.receiverAddress.address}
                    secondary={`@${order.receiver.username}`}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                variant="contained"
                color="secondary"
                className={styles.marginLeft}
                onClick={() => {
                  setOrderActions({
                    orderId: order.orderId,
                    action: "Reject",
                    status: "Rejected",
                  });
                  handleModal(true);
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={styles.marginLeft}
                onClick={() => {
                  setOrderActions({
                    orderId: order.orderId,
                    action: "Approve",
                    status: "Approved",
                  });
                  handleModal(true);
                }}
              >
                Approve
              </Button>
            </CardActions>
          </Card>
        ))}
        <Modal
          className={styles.center}
          open={open}
          onClose={() => handleModal(false)}
        >
          <Card className={styles.paddingAll}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {`${orderActions.action} ${orderActions.orderId}?`}
              </Typography>
              <Typography gutterBottom>
                {`Do you want to ${orderActions.action} order ${orderActions.orderId}?`}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                className={styles.marginLeft}
                onClick={() => handleModal(false)}
              >
                Back
              </Button>
              <Mutation
                mutation={schema.mutation.updateOrderStatus}
                variables={{
                  orderId: orderActions.orderId,
                  status: orderActions.status,
                }}
                onCompleted={() => {
                  refetch();
                  handleModal(false);
                }}
              >
                {(mutation) => (
                  <Button
                    variant="contained"
                    color={
                      orderActions.action === "Reject" ? "secondary" : "primary"
                    }
                    className={styles.marginLeft}
                    onClick={mutation}
                  >
                    {orderActions.action}
                  </Button>
                )}
              </Mutation>
            </CardActions>
          </Card>
        </Modal>
      </Container>
    </div>
  );
}
