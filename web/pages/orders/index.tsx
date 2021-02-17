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
import { useQuery, useSubscription } from "react-apollo";
import { useRouter } from "next/router";
import { ArrowForwardIcon, RepeatIcon } from "@chakra-ui/icons";
import schema from "../../utils/schema";
import AppBar from "../../components/appbar";
import DisplayName from "../../components/display-name";
import { mapStatusToColor } from "../../utils/convert";

export default function Orders() {
  const router = useRouter();
  const toast = useToast();
  const [keywords, setKeywords] = useState("");
  const [isRefetching, setRefetching] = useState(false);
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

  const ordersRefetch = async () => {
    setRefetching(true);
    await refetch();
    setRefetching(false);
    toast({
      position: "bottom-right",
      title: "Refetch Completed!",
      status: "success",
      duration: null,
      isClosable: true,
    });
  };

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

  const makeToast = ({ title, description }) => {
    toast({
      position: "bottom-right",
      title,
      description,
      status: "warning",
      duration: null,
      isClosable: true,
    });
  };

  useSubscription(schema.subscription.orderCreated, {
    onSubscriptionData: ({ subscriptionData }) => {
      refetch().then(() => {
        makeToast({
          title: "A New Order is Coming!",
          description: orderDesc(subscriptionData.orderCreated.orderId),
        });
      });
    },
  });

  useSubscription(schema.subscription.orderStatusUpdated, {
    onSubscriptionData: ({ subscriptionData }) => {
      refetch().then(() => {
        makeToast({
          title: "An Order Status is Updated!",
          description: orderDesc(subscriptionData.orderStatusUpdated.orderId),
        });
      });
    },
  });

  return (
    <>
      <AppBar />
      <Container maxW="full" h="calc(100vh - 100.8px)" p="0">
        <Stack spacing={3} h="100%" p="3">
          <Flex justify="space-between" align="center">
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <IconButton
              aria-label="Refetch Orders"
              onClick={ordersRefetch}
              isLoading={isRefetching}
              variant="ghost"
              icon={<RepeatIcon />}
            />
          </Flex>
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
            <GridItem overflow="auto" colSpan={4}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Order ID</Th>
                    <Th>Status</Th>
                    <Th>Sender</Th>
                    <Th>Send Address</Th>
                    <Th>Receiver</Th>
                    <Th>Receive Address</Th>
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
                        <Td>{order.orderId}</Td>
                        <Td>
                          <Flex>
                            <Badge colorScheme={mapStatusToColor(order.status)}>
                              {order.status}
                            </Badge>
                          </Flex>
                        </Td>
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
                          <IconButton
                            aria-label="View Order"
                            variant="link"
                            icon={<ArrowForwardIcon />}
                            onClick={() =>
                              router.push(`/orders/${order.orderId}`)}
                          />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
              {orders?.filter(
                (order) =>
                  selectedStatuses.includes(order.status) &&
                  order.orderId.includes(keywords)
              ).length <= 0 && (
                <Text
                  p="3"
                  textAlign="center"
                  color="gray.600"
                  fontWeight="bold"
                >
                  No Orders Here.
                </Text>
              )}
            </GridItem>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
