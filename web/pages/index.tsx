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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Checkbox,
  Flex,
  Badge,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery, useMutation, Subscription } from "react-apollo";
import { useRouter } from "next/router";
import { EditIcon } from "@chakra-ui/icons";
import schema from "../utils/schema";
import AppBar from "../components/appbar";
import { client } from "./_app";

export default function Home() {
  const router = useRouter();
  const [ordersSelected, setOrdersSelected] = useState({});
  const { data: me, loading, error } = useQuery(schema.query.me);
  const [signOut] = useMutation(schema.mutation.signOut);
  const { data: orders, refetch, fetchMore } = useQuery(schema.query.orders, {
    variables: {
      input: { pagination: { page: 1, size: 20 }, status: "Pending" },
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateOrderStatus] = useMutation(schema.mutation.updateOrderStatus, {
    onCompleted: () => {
      setOrdersSelected({});
      refetch();
      onClose();
    },
  });
  const [orderActions, setOrderActions] = useState({
    orderId: null,
    action: null,
    status: null,
  });
  const [orderHover, setOrderHover] = useState("");

  const allOrdersSelected = () => {
    return (
      Object.keys(ordersSelected).length ===
        (orders?.orders?.orders?.length ?? false) &&
      Object.values(ordersSelected).every(Boolean)
    );
  };

  if (loading) {
    return <></>;
  }

  if (error) {
    router.replace("/sign-in");
    return <></>;
  }
  // onApprove={() => {
  //   setOrderActions({
  //     orderId: order.orderId,
  //     action: "Approve",
  //     status: "Approved",
  //   });
  //   onOpen();
  // }}
  // onReject={() => {
  //   setOrderActions({
  //     orderId: order.orderId,
  //     action: "Reject",
  //     status: "Rejected",
  //   });
  //   onOpen();
  // }}
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
      <Container maxW="6xl" pb="3" pt="100.8px">
        <Stack spacing="4">
          <Heading pt="3" color="blue.400">
            Orders
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>
                  <Checkbox
                    isChecked={allOrdersSelected()}
                    isIndeterminate={
                      Object.values(ordersSelected).some(Boolean) &&
                      !allOrdersSelected()
                    }
                    onChange={() => {
                      setOrdersSelected(
                        orders?.orders?.orders?.reduce((prev, cur) => {
                          return {
                            ...prev,
                            [cur.orderId]: allOrdersSelected() !== true,
                          };
                        }, {})
                      );
                    }}
                  />
                </Th>
                <Th>Order ID</Th>
                <Th>Sender</Th>
                <Th>Send Address</Th>
                <Th>Receiver</Th>
                <Th>Receive Address</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders?.orders?.orders?.map((order) => (
                <Tr
                  key={order.orderId}
                  _hover={{ background: "gray.100" }}
                  onMouseEnter={() => setOrderHover(order.orderId)}
                >
                  <Td>
                    <Checkbox
                      isChecked={ordersSelected[order.orderId] === true}
                      onChange={() => {
                        setOrdersSelected({
                          ...ordersSelected,
                          [order.orderId]: !(
                            ordersSelected[order.orderId] ?? false
                          ),
                        });
                      }}
                    />
                  </Td>
                  <Td>{order.orderId}</Td>
                  <Td>
                    <Text>{`${order.sender.firstName} ${order.sender.lastName}`}</Text>
                    <Text fontSize="sm" color="gray.500">
                      @{order.sender.username}
                    </Text>
                  </Td>
                  <Td>
                    <Text>{order.sendAddress}</Text>
                  </Td>
                  <Td>
                    <Text>{`${order.receiver.firstName} ${order.receiver.lastName}`}</Text>
                    <Text fontSize="sm" color="gray.500">
                      @{order.receiver.username}
                    </Text>
                  </Td>
                  <Td>
                    <Text>{order.receiveAddress}</Text>
                  </Td>
                  <Td>
                    <Flex>
                      <Badge colorScheme="gray">{order.status}</Badge>
                      {order.orderId === orderHover && (
                        <IconButton
                          colorScheme="blue"
                          variant="link"
                          icon={<EditIcon />}
                          onClick={onOpen}
                        />
                      )}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Subscription subscription={schema.subscription.orderCreated}>
            {() => {
              refetch();
              return <></>;
            }}
          </Subscription>
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
                      input: {
                        orderId: orderActions.orderId,
                        status: orderActions.status,
                        comments: `${orderActions.action} by @${me.me.username}`,
                      },
                    },
                  })
                }
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
