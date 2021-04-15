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
import { MdMail, MdPhone } from "react-icons/md";
import schema from "../../utils/schema";
import AppBar from "../../components/appbar";
import DisplayName from "../../components/display-name";
import { mapStatusToColor } from "../../utils/convert";

export default function Post() {
  const router = useRouter();
  const toast = useToast();
  const [isRefetching, setRefetching] = useState(false);
  const [getDriver, { data, loading: driverLoading, refetch }] = useLazyQuery(
    schema.query.user
  );

  useEffect(() => {
    if (router?.query) {
      getDriver({
        variables: { userId: Number(router.query.id) },
      });
    }
  }, [router]);

  if (driverLoading || !data) {
    return <></>;
  }

  const driverRefetch = async () => {
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
                <BreadcrumbLink href="/driver">Drivers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href={`/driver/${router.query.id}`}>
                  {router.query.id}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <IconButton
              aria-label="Refetch Orders"
              onClick={driverRefetch}
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

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Job ID</Th>
                <Th>Job Status</Th>
                <Th>Order ID</Th>
                <Th>Orde Status</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {data.user.jobs.map((job) => (
                <Tr
                  key={job.jobId}
                  _hover={{ background: "gray.100" }}
                  onClick={() => router.push(`/order/${job.order.orderId}`)}
                >
                  <Td>{job.jobId}</Td>
                  <Td>
                    <Flex>
                      <Badge
                        colorScheme={
                          job.status === "Processing" ? "yellow" : "green"
                        }
                      >
                        {job.status}
                      </Badge>
                    </Flex>
                  </Td>
                  <Td>{job.order.orderId}</Td>
                  <Td>
                    <Flex>
                      <Badge colorScheme={mapStatusToColor(job.order.status)}>
                        {job.order.status}
                      </Badge>
                    </Flex>
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="View Order"
                      variant="link"
                      icon={<ArrowForwardIcon />}
                      onClick={() =>
                        router.push(`/order/${job.order.orderId}`)
                      }
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {data.user.jobs?.length <= 0 && (
            <Text p="3" textAlign="center" color="gray.600" fontWeight="bold">
              No Jobs Here.
            </Text>
          )}
        </Stack>
      </Container>
    </>
  );
}
