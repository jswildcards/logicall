import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Subscription,
  useLazyQuery,
  useMutation,
  useQuery,
} from "react-apollo";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Grid,
  GridItem,
  Text,
  Box,
  Stack,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Divider,
  Icon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import moment from "moment-timezone";
import { ArrowDownIcon, RepeatIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { MdMap } from "react-icons/md";
import schema from "../../utils/schema";
import AppBar from "../../components/appbar";
import DisplayName from "../../components/display-name";
import { mapStatusToColor, mapStringToPolylines } from "../../utils/convert";

export default function Post() {
  const router = useRouter();
  const { data: me } = useQuery(schema.query.me);
  const [getOrder, { data, loading: orderLoading, refetch }] = useLazyQuery(
    schema.query.order
  );
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isRefetching, setRefetching] = useState(false);
  const [updateOrderStatus] = useMutation(schema.mutation.updateOrderStatus, {
    onCompleted: () => {
      refetch();
      onClose();
    },
  });
  const [orderActions, setOrderActions] = useState({
    action: null,
    status: null,
  });
  const Map = useMemo(
    () =>
      dynamic(() => import("../../components/map"), {
        loading: () => <Text>Loading</Text>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    if (router?.query) {
      getOrder({
        variables: { orderId: router.query.id },
      });
    }
  }, [router]);

  if (orderLoading || !data) {
    return <></>;
  }

  const { order } = data;
  const duration = order.jobs?.[0]?.duration ?? order.estimatedDuration;
  const polylines = mapStringToPolylines(
    order.jobs?.[0]?.polylines ?? order.suggestedPolylines
  );

  const onApprove = () => {
    setOrderActions({
      action: "Approve",
      status: "Approved",
    });
    onOpen();
  };

  const onReject = () => {
    setOrderActions({
      action: "Reject",
      status: "Rejected",
    });
    onOpen();
  };

  const orderRefetch = async () => {
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

  return (
    <>
      <AppBar />
      <Container maxW="full" p="0" h="calc(100vh - 100.8px)">
        <Grid maxW="full" h="100%" templateColumns="repeat(3,1fr)">
          <GridItem overflow="auto" p="3" colSpan={1}>
            <Stack spacing="4">
              <Flex justify="space-between" align="center">
                <Breadcrumb>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href={`/orders/${order.orderId}`}>
                      {order.orderId}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>

                <IconButton
                  aria-label="Refetch Orders"
                  onClick={orderRefetch}
                  isLoading={isRefetching}
                  variant="ghost"
                  icon={<RepeatIcon />}
                />
              </Flex>

              <Divider />

              <Box>
                <Text color="gray.500" fontSize="2xl">
                  {order.orderId}
                </Text>
                <Badge colorScheme={mapStatusToColor(order.status)}>
                  {order.status}
                </Badge>
              </Box>

              {order.status === "Pending" && (
                <>
                  <Divider />
                  <Flex justify="space-between" align="center">
                    <Text color="gray.500" fontSize="2xl">
                      Actions
                    </Text>
                    <Stack direction="row">
                      <Button
                        variant="ghost"
                        colorScheme="red"
                        onClick={onReject}
                      >
                        Reject
                      </Button>
                      <Button colorScheme="green" onClick={onApprove}>
                        Approve
                      </Button>
                    </Stack>
                  </Flex>
                </>
              )}

              <Divider />

              <Stack spacing="2">
                <Text color="gray.500" fontSize="2xl">
                  Order Details
                </Text>
                <DisplayName user={order.sender} />
                <Stack direction="row" align="center">
                  <Icon as={MdMap} />
                  <Text>{order.sendAddress}</Text>
                </Stack>
                <Flex justify="center">
                  <ArrowDownIcon />
                </Flex>
                <DisplayName user={order.receiver} />
                <Stack direction="row" align="center">
                  <Icon as={MdMap} />
                  <Text>{order.receiveAddress}</Text>
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing="2">
                <Text color="gray.500" fontSize="2xl">
                  Driver Details
                </Text>
                {!(order.jobs?.[0]?.driver ?? false) && (
                  <Flex align="center">
                    <SmallCloseIcon color="red.500" />
                    <Text>No Driver Details Yet</Text>
                  </Flex>
                )}
                {order.jobs?.[0]?.driver && (
                  <DisplayName user={order.jobs[0].driver} />
                )}
              </Stack>

              <Divider />

              <Box>
                <Text color="gray.500" fontSize="2xl">
                  Recent Activities
                </Text>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Time</Th>
                      <Th>Status</Th>
                      <Th>Comments</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {order.logs.map((log) => (
                      <Tr
                        key={log.orderLogId}
                        _hover={{ background: "gray.100" }}
                      >
                        <Td>
                          {moment
                            .tz(Number(log.createdAt), "Asia/Hong_Kong")
                            .format("YYYY-MM-DD HH:mm")}
                        </Td>
                        <Td>
                          <Badge colorScheme={mapStatusToColor(log.status)}>
                            {log.status}
                          </Badge>
                        </Td>
                        <Td>{log.comments}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Stack>
          </GridItem>
          <GridItem colSpan={2}>
            <Map
              markers={[
                { ...order.sendLatLng, message: `Start: ${order.sendAddress}` },
                {
                  ...order.receiveLatLng,
                  message: `End: ${order.receiveAddress}`,
                },
              ]}
              polylines={[
                [
                  polylines,
                  [
                    `${
                      order.jobs?.[0]?.status === "Finished"
                        ? `Duration: ${Math.floor(order.duration / 60)} min ${
                            order.duration % 60
                          } sec`
                        : ""
                    }`,
                    `Estimated Duration: ${Math.floor(duration / 60)} min ${
                      duration % 60
                    } sec`,
                  ],
                ],
              ]}
            />
          </GridItem>
        </Grid>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {`${orderActions.action} ${order.orderId}?`}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {`Do you want to ${orderActions.action?.toLowerCase()} order ${
                order.orderId
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
                        orderId: order.orderId,
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
        <Subscription subscription={schema.subscription.orderStatusUpdated}>
          {() => {
            refetch();
            return <></>;
          }}
        </Subscription>
      </Container>
    </>
  );
}
