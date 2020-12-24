import {
  Button,
  CircularProgress,
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
import { Container, Heading, Grid, GridItem, Flex } from "@chakra-ui/react";
import { ArrowForward } from "@material-ui/icons";
import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo";
import { useRouter } from "next/router";
import schema from "../utils/schema";
import AppBar from "../components/appbar";

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
  const { data: me, loading, error } = useQuery(schema.query.me);
  const { data: orders, refetch } = useQuery(schema.query.orders);
  const [open, setOpen] = useState(false);
  const handleModal = (state: boolean) => setOpen(state);
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
      <AppBar user={me} />
      <Container maxW="6xl">
        <Heading color="blue.400" paddingY="3">
          Incoming Orders
        </Heading>
        {orders?.orders?.map((order) => (
          <Box width="100%">
            <Heading color="gray.400" size="sm" paddingBottom="1">
              {order.orderId}
            </Heading>
            <Heading
              color={order.status === "Rejected" ? "red.500" : "green.500"}
              size="sm"
              paddingBottom="1"
            >
              {order.status}
            </Heading>
            <Grid templateColumns="repeat(5, 1fr)" paddingY="3">
              <GridItem colSpan={2}>
                <ListItemText
                  primary={order.senderAddress.address}
                  secondary={`@${order.sender.username}`}
                />
              </GridItem>
              <GridItem colSpan={1}>
                <Flex h="100%" justify="center" align="center">
                  <ArrowForward />
                </Flex>
              </GridItem>
              <GridItem colSpan={2}>
                <ListItemText
                  className={styles.end}
                  primary={order.receiverAddress.address}
                  secondary={`@${order.receiver.username}`}
                />
              </GridItem>
            </Grid>
            <Divider />
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
          </Box>
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
                  })
                }
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
