import React from "react";
import { SimpleGrid, Image, Flex, Stack, Container } from "@chakra-ui/react";
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
    <SimpleGrid h="100vh" columns={{ base: 1, md: 2 }}>
      <Flex
        display={{ base: "none", md: "flex" }}
        h="100vh"
        style={{ background: "#7e89fd" }}
        justify="center"
        align="center"
      >
        <Image src="/logicall-banner.png" alt="" />
      </Flex>
      <Container pt="8">
        <Stack spacing="12">
          <Flex justify="center" align="center">
            <Image width="30%" src="/box.svg" alt="" />
          </Flex>
          <SignInForm />
        </Stack>
      </Container>
    </SimpleGrid>
  );
}
