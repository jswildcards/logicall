import {
  Button,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useQuery } from "react-apollo";
import AppBar from "../components/appbar";
import schema from "../utils/schema";

export default function Home() {
  const { data: me, loading } = useQuery(schema.query.me);

  if (loading) {
    return <></>;
  }

  return (
    <>
      <AppBar />

      <Container maxW="6xl" pt="100.8px">
        <Stack p="3" spacing="4">
          <Text fontSize="3xl" color="gray.600">
            Welcome, @{me.me.username}.
          </Text>
          <Text color="gray.600">
            Click on the following boxes to get started.
          </Text>
          <Link href="/orders">
            <Box borderRadius="md" p="8" as="button" bg="gray.100">
              <Stack justify="center" align="center">
                <Image height="124px" src="/orders.svg" alt="" />
                <Text>Orders</Text>
              </Stack>
            </Box>
          </Link>
          <Link href="/drivers">
            <Box borderRadius="md" p="8" as="button" bg="gray.100">
              <Stack justify="center" align="center">
                <Image height="124px" src="/drivers.svg" alt="" />
                <Text>Drivers</Text>
              </Stack>
            </Box>
          </Link>
        </Stack>
      </Container>
    </>
  );
}
