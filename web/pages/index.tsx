import {
  Container,
  Heading,
  Button,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo";
import { useRouter } from "next/router";
import schema from "../utils/schema";
import AppBar from "../components/appbar";
import OrderCard from "../components/order-card";
import { client } from "./_app";

export default function Home() {
  const router = useRouter();
  const { data: me, loading, error } = useQuery(schema.query.me,);
  const [signOut] = useMutation(schema.mutation.signOut);
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
      <AppBar
        user={me}
        signOut={() => {
          signOut().then(() => {
            client.cache.reset();
            router.replace("/sign-in");
          });
        }}
      />
      <Container maxW="6xl" py="3">
        <Stack spacing="4">
          <Heading color="blue.400">Orders</Heading>
          {orders?.orders?.map((order) => (
            <OrderCard
              order={order}
              onApprove={() => {
                setOrderActions({
                  orderId: order.orderId,
                  action: "Approve",
                  status: "Approved",
                });
                onOpen();
              }}
              onReject={() => {
                setOrderActions({
                  orderId: order.orderId,
                  action: "Reject",
                  status: "Rejected",
                });
                onOpen();
              }}
            />
          ))}
        </Stack>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {`${orderActions.action} ${orderActions.orderId}?`}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {`Do you want to ${orderActions.action?.toLowerCase()} order ${
                orderActions.orderId
              }?`}
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
