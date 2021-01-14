import { Container, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useQuery, useMutation } from "react-apollo";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import schema from "../utils/schema";
import AppBar from "../components/appbar";
import { client } from "./_app";

export default function Drivers() {
  const router = useRouter();
  const { data: me, loading, error } = useQuery(schema.query.me);
  const [signOut] = useMutation(schema.mutation.signOut);
  const Map = useMemo(
    () =>
      dynamic(() => import("../components/map"), {
        loading: () => <Text>Loading</Text>,
        ssr: false,
      }),
    []
  );

  if (loading) {
    return <></>;
  }

  if (error) {
    router.replace("/sign-in");
    return <></>;
  }

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

      <Container maxW="full" h="100vh" p="0" pt="100.8px">
        <Map markers={[{ latitude: 22.4, longitude: 114.1 }]} />
      </Container>
    </>
  );
}
