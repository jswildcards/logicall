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
import { Container } from "@chakra-ui/react";
import { ArrowForward, Menu } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-apollo";
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
  const [open, setOpen] = useState(false);
  const handleModal = (state: boolean) => setOpen(state);
  const [signOut] = useMutation(schema.mutation.signOut);
  const [updateOrderStatus] = useMutation(schema.mutation.updateOrderStatus, {
    onCompleted: () => {
      refetch();
      handleModal(false);
    },
  });
  const styles = useStyles();
  const [orderActions, setOrderActions] = useState({
    orderId: null,
    action: null,
    status: null,
  });

  useEffect(() => {
    // if (!user || !Object.keys(user).length) {
    //   setSignedIn(false);
    //   router.push("sign-in");
    // }
    // setLoading(false);
  });

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
          <Button
            color="inherit"
            onClick={() => {
              signOut();
              router.replace("sign-in");
            }}
          >
            {data.me.username}
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography className={styles.paddingVertical} variant="h5">
          Incoming testing
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
              <Button
                variant="contained"
                color={
                  orderActions.action === "Reject" ? "secondary" : "primary"
                }
                className={styles.marginLeft}
                onClick={() =>
                  updateOrderStatus({
                    variables: {
                      orderId: orderActions.orderId,
                      status: orderActions.status,
                    },
                  })}
              >
                {orderActions.action}
              </Button>
            </CardActions>
          </Card>
        </Modal>
      </Container>
    </div>
  );
}
