import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLazyQuery } from "react-apollo";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
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
  IconButton,
  Badge,
  useToast,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { ArrowForwardIcon, RepeatIcon } from "@chakra-ui/icons";
import { MdPhone, MdMail } from "react-icons/md";
import schema from "../../utils/schema";
import AppBar from "../../components/appbar";
import DisplayName from "../../components/display-name";
import { mapStatusToColor } from "../../utils/convert";

export default function Post() {
  const router = useRouter();
  const toast = useToast();
  const [isRefetching, setRefetching] = useState(false);
  const [
    getCustomer,
    { data, loading: customerLoading, refetch },
  ] = useLazyQuery(schema.query.user);

  useEffect(() => {
    if (router?.query) {
      getCustomer({
        variables: { userId: Number(router.query.id) },
      });
    }
  }, [router]);

  if (customerLoading || !data) {
    return <></>;
  }

  const customerRefetch = async () => {
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
      <Container maxW="6xl">
        <Stack p="3" spacing="4">
          <Flex justify="space-between" align="center">
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/customer">Customers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href={`/customer/${router.query.id}`}>
                  {router.query.id}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <IconButton
              aria-label="Refetch Orders"
              onClick={customerRefetch}
              isLoading={isRefetching}
              variant="ghost"
              icon={<RepeatIcon />}
            />
          </Flex>

          <Divider />

          <SimpleGrid columns={2}>
            <DisplayName user={data.user} />

            <Flex
              color="gray.500"
              direction="column"
              justify="center"
              justifySelf="end"
            >
              <Flex align="center">
                <Icon as={MdPhone} />
                <Text ml="2">{data.user.phone}</Text>
              </Flex>

              <Flex align="center">
                <Icon as={MdMail} />
                <Text ml="2">{data.user.email}</Text>
              </Flex>
            </Flex>
          </SimpleGrid>

          <Box overflow="auto">
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
                {[
                  ...(data.user.sendOrders ?? []),
                  ...(data.user.receiveOrders ?? []),
                ]?.map((order) => (
                  <Tr
                    key={order.orderId}
                    _hover={{ background: "gray.100" }}
                    onClick={() => router.push(`/order/${order.orderId}`)}
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
                        onClick={() => router.push(`/order/${order.orderId}`)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {data.user.sendOrders?.length <= 0 &&
              data.user.receiveOrders?.length <= 0 && (
                <Text
                  p="3"
                  textAlign="center"
                  color="gray.600"
                  fontWeight="bold"
                >
                  No Orders Here.
                </Text>
              )}
          </Box>
        </Stack>
      </Container>
    </>
  );
}
