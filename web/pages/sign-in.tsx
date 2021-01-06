import React from "react";
import {
  SimpleGrid,
  Image,
  Flex,
  Stack,
  Container,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import SignInForm from "../components/sign-in-form";
import schema from "../utils/schema";

export default function SignIn() {
  const router = useRouter();
  const { data: user, loading } = useQuery(schema.query.me);

  if (loading) return <></>;

  if (user?.me?.role) {
    router.push("/");
    return <></>;
  }

  return (
    <Container pt="8">
      <Stack spacing="8">
        <Flex justify="center" color="gray.600" align="center" direction="column">
          <Image width="30%" src="/box.svg" alt="" />
          <Heading as="h1" size="lg" mt="4">
            LogiCall
          </Heading>
          <Heading as="h5" size="xs">
            admin
          </Heading>
        </Flex>
        <SignInForm />
      </Stack>
    </Container>
  );
}
