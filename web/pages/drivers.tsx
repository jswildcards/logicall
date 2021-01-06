import { Container } from "@chakra-ui/react";
import React from "react";
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
  const MapWithNoSSR = dynamic(() => import("../components/map"), {
    ssr: false
  });

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
      
      <Container maxW="6xl" h="3xl" py="3">
        <MapWithNoSSR />
      </Container>
    </>
  );
}
