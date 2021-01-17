import {
  Container,
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
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  GridItem,
  Grid,
  Stack,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery, useMutation, Subscription } from "react-apollo";
import { useRouter } from "next/router";
import { ArrowForwardIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import schema from "../../utils/schema";
import AppBar from "../../components/appbar";
import DisplayName from "../../components/display-name";
import { mapStatusToColor } from "../../utils/convert";

export default function Orders() {
  const router = useRouter();
  const toast = useToast();
  const [keywords, setKeywords] = useState("");
  // const [ordersSelected, setOrdersSelected] = useState({});
  const statuses = [
    "Pending",
    "Approved",
    "Rejected",
    "Cancelled",
    "Collecting",
    "Delivering",
    "Delivered",
  ];
  const [selectedStatuses, setSelectedStatuses] = useState([...statuses]);
  const { data, loading, refetch } = useQuery(schema.query.orders);

  if (loading) {
    return <></>;
  }

  // const allOrdersSelected = () => {
  //   return (
  //     Object.keys(ordersSelected).length > 0 &&
  //     Object.keys(ordersSelected).length ===
  //       (orders?.orders?.orders?.length ?? false) &&
  //     Object.values(ordersSelected).every(Boolean)
  //   );
  // };

  const { orders } = data;
  const orderDesc = (orderId) => {
    return (
      <>
        <Text>Order ID: </Text>
        <Button
          variant="link"
          colorScheme="white"
          onClick={() => router.push(`/orders/${orderId}`)}
        >
          {orderId}
        </Button>
      </>
    );
  };

  return (
    <>
      <AppBar />
      <Container maxW="full" pt="100.8px">
        <Stack spacing={3} p="3">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Grid maxW="full" h="100%" gap={3} templateColumns="repeat(5,1fr)">
            <GridItem colSpan={1}>
              <Stack>
                <Text fontSize="xl" color="gray.500">
                  Filter Orders
                </Text>
                <Text color="gray.500">Keywords</Text>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter Keywords..."
                />
                <Text color="gray.500">Order Status</Text>
                {statuses.map((status) => {
                  return (
                    <Checkbox
                      isChecked={selectedStatuses.includes(status)}
                      key={status}
                      onChange={() => {
                        const array = selectedStatuses.includes(status)
                          ? selectedStatuses.filter((s) => s !== status)
                          : [...selectedStatuses, status];
                        setSelectedStatuses(array);
                      }}
                    >
                      <Badge colorScheme={mapStatusToColor(status)}>
                        {status}
                      </Badge>
                    </Checkbox>
                  );
                })}
              </Stack>
            </GridItem>
            <GridItem overflow="scroll" colSpan={4}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {/* <Th>
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
              </Th> */}
                    <Th>Order ID</Th>
                    <Th>Sender</Th>
                    <Th>Send Address</Th>
                    <Th>Receiver</Th>
                    <Th>Receive Address</Th>
                    <Th>Status</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {orders
                    ?.filter(
                      (order) =>
                        selectedStatuses.includes(order.status) &&
                        order.orderId.includes(keywords)
                    )
                    .map((order) => (
                      <Tr
                        key={order.orderId}
                        _hover={{ background: "gray.100" }}
                        onClick={() => router.push(`/orders/${order.orderId}`)}
                      >
                        {/* <Td>
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
                </Td> */}
                        <Td>{order.orderId}</Td>
                        <Td>
                          <DisplayName user={order.sender} />
                        </Td>
                        <Td>
                          <Text>{order.sendAddress}</Text>
                        </Td>
                        <Td>
                          <DisplayName user={order.receiver} />
                        </Td>
                        <Td>
                          <Text>{order.receiveAddress}</Text>
                        </Td>
                        <Td>
                          <Flex>
                            <Badge colorScheme={mapStatusToColor(order.status)}>
                              {order.status}
                            </Badge>
                          </Flex>
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="View Order"
                            variant="link"
                            icon={<ArrowForwardIcon />}
                            onClick={() =>
                              router.push(`/orders/${order.orderId}`)
                            }
                          />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
              {/* <Button
                onClick={() =>
                  toast({
                    description: (
                      <Button
                        onClick={() => router.push("/drivers")}
                        colorScheme="blue"
                      >
                        ASD
                      </Button>
                    ),
                  })
                }
              >
                1
              </Button> */}
            </GridItem>
          </Grid>
          <Subscription subscription={schema.subscription.orderCreated}>
            {({ data: subData, loading: subLoading }) => {
              if (subLoading || !subData) return <></>;

              toast({
                position: "bottom-right",
                title: "A New Order is Coming!",
                description: orderDesc(subData.orderCreated.orderId),
                status: "warning",
                duration: null,
                isClosable: true,
              });
              refetch();
              return <></>;
            }}
          </Subscription>
          <Subscription subscription={schema.subscription.orderStatusUpdated}>
            {({ data: subData, loading: subLoading }) => {
              if (subLoading || !subData) return <></>;

              toast({
                position: "bottom-right",
                title: "An Order Status is Updated!",
                description: orderDesc(subData.orderStatusUpdated.orderId),
                status: "warning",
                duration: null,
                isClosable: true,
              });
              refetch();
              return <></>;
            }}
          </Subscription>
          {/* <Modal isOpen={isOpen} onClose={onClose}>
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
        </Modal> */}
        </Stack>
      </Container>
    </>
  );
}
