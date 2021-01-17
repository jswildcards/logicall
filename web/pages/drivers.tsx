import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Subscription, useMutation, useSubscription } from "react-apollo";
import AppBar from "../components/appbar";
import schema from "../utils/schema";

export default function Drivers() {
  const [markers, setMarkers] = useState([]);
  const [requestCurrentLocation] = useMutation(
    schema.mutation.requestCurrentLocation
  );
  const Map = useMemo(
    () =>
      dynamic(() => import("../components/map"), {
        loading: () => <Text>Loading</Text>,
        ssr: false,
      }),
    []
  );
  const {
    data: currentLocationResponsed,
    loading: subloading,
  } = useSubscription(schema.subscription.currentLocationResponsed, {
    onSubscriptionData: ({ subscriptionData }) => {
      const { user, latLng } = subscriptionData.data.currentLocationResponsed;
      const m = markers.filter(
        (marker) => marker.user.username !== user.username
      );
      setMarkers([...m, { ...latLng, user }]);
    },
  });

  return (
    <>
      <AppBar />
      <Container maxW="full" h="100vh" p="0" pt="100.8px">
        <Grid maxW="full" h="100%" templateColumns="repeat(3,1fr)">
          <GridItem overflow="scroll" p="3" colSpan={1}>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="/drivers">Drivers</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Button onClick={requestCurrentLocation}>Update</Button>
          </GridItem>
          <GridItem colSpan={2}>
            <Map markers={[...markers]} />
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}
