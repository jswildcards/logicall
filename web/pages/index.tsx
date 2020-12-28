import {
  Box,
  Container,
  Heading,
  Grid,
  GridItem,
  Flex,
  Text,
  Divider,
  Button,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { ArrowForward } from "@material-ui/icons";
import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo";
import { useRouter } from "next/router";
import schema from "../utils/schema";
import AppBar from "../components/appbar";

export default function Home() {
  const router = useRouter();
  const { data: me, loading, error } = useQuery(schema.query.me);
  const { data: orders, refetch } = useQuery(schema.query.orders);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateOrderStatus] = useMutation(schema.mutation.updateOrderStatus, {
    onCompleted: () => {
      refetch();
      onClose();
    },
  });
  const [orderActions, setOrderActions] = useState({
    orderId: null,
    action: null,
    status: null,
  });

  if (loading) {
    return <></>;
  }

  if (error) {
    router.replace("/sign-in");
    return <></>;
  }

  return (
    <>
      <AppBar user={me} />
      <Container maxW="6xl">
        <Heading color="blue.400" py="3">
          Incoming Orders
        </Heading>
        {orders?.orders?.map((order) => (
          <Box
            border="1px"
            borderColor="gray.300"
            borderRadius="md"
            p="3"
            width="100%"
          >
            <Heading color="gray.500" size="sm" pb="1">
              {order.orderId}
            </Heading>
            <Heading
              color={order.status === "Rejected" ? "red.500" : "green.500"}
              size="sm"
              pb="1"
            >
              {order.status}
            </Heading>
            <Grid templateColumns="repeat(5, 1fr)" py="3">
              <GridItem colSpan={2}>
                <Text>{order.senderAddress.address}</Text>
                <Text color="gray.500">
                  @
                  {order.sender.username}
                </Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Flex h="100%" justify="center" align="center">
                  <ArrowForward />
                </Flex>
              </GridItem>
              <GridItem colSpan={2} textAlign="right">
                <Text>{order.receiverAddress.address}</Text>
                <Text color="gray.500">
                  @
                  {order.receiver.username}
                </Text>
              </GridItem>
            </Grid>
            <Divider />
            <Flex justify="right" pt="3">
              <Button
                variant="ghost"
                colorScheme="red"
                mr="3"
                onClick={() => {
                  setOrderActions({
                    orderId: order.orderId,
                    action: "Reject",
                    status: "Rejected",
                  });
                  onOpen();
                }}
              >
                Reject
              </Button>
              <Button
                colorScheme="green"
                onClick={() => {
                  setOrderActions({
                    orderId: order.orderId,
                    action: "Approve",
                    status: "Approved",
                  });
                  onOpen();
                }}
              >
                Approve
              </Button>
            </Flex>
          </Box>
        ))}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {`${orderActions.action} ${orderActions.orderId}?`}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {`Do you want to ${orderActions.action} order ${orderActions.orderId}?`}
            </ModalBody>
            <ModalFooter>
              <Button bg="white" variant="ghost" mr="3" onClick={onClose}>
                Back
              </Button>
              <Button
                colorScheme={orderActions.action === "Reject" ? "red" : "green"}
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
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
}
