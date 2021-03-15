import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Flex,
  Text,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  GridItem,
  Grid,
  Stack,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { useRouter } from "next/router";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import schema from "../../utils/schema";
import AppBar from "../../components/appbar";
import DisplayName from "../../components/display-name";
import { filterUsers } from "../../utils/convert";

export default function Orders() {
  const router = useRouter();
  const [keywords, setKeywords] = useState("");
  const { data, loading } = useQuery(schema.query.customers);

  if (loading) {
    return <></>;
  }

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
                <BreadcrumbLink href="/customer">Customers</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Flex>
          <Grid maxW="full" h="100%" gap={3} templateColumns="repeat(5,1fr)">
            <GridItem colSpan={1}>
              <Stack>
                <Text fontSize="xl" color="gray.500">
                  Filter Customers
                </Text>
                <Text color="gray.500">Keywords</Text>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value.toLowerCase())}
                  placeholder="Enter Keywords..."
                />
              </Stack>
            </GridItem>
            <GridItem overflow="auto" colSpan={4}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Customer ID</Th>
                    <Th>Customer Badge</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {filterUsers(keywords, data.customers)?.map((customer) => (
                    <Tr
                      key={customer.userId}
                      _hover={{ background: "gray.100", cursor: "pointer" }}
                      onClick={() =>
                        router.push(`/customer/${customer.userId}`)
                      }
                    >
                      <Td>{customer.userId}</Td>
                      <Td>
                        <DisplayName user={customer} />
                      </Td>
                      <Td>
                        <IconButton
                          aria-label="View Order"
                          variant="link"
                          icon={<ArrowForwardIcon />}
                          onClick={() =>
                            router.push(`/customer/${customer.userId}`)
                          }
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </GridItem>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
