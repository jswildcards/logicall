import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useMutation, useSubscription } from "react-apollo";
import { RepeatIcon } from "@chakra-ui/icons";
import moment from "moment-timezone";
import AppBar from "../components/appbar";
import schema from "../utils/schema";

export default function Drivers() {
  const [markers, setMarkers] = useState([]);
  const [requestCurrentLocation] = useMutation(
    schema.mutation.requestCurrentLocation
  );
  const toast = useToast();
  const [isRefetching, setRefetching] = useState(false);
  const Map = useMemo(
    () =>
      dynamic(() => import("../components/map"), {
        loading: () => <Text>Loading</Text>,
        ssr: false,
      }),
    []
  );
  const [logs, setLogs] = useState([]);
  const {
    data: currentLocationResponsed,
    loading: subloading,
  } = useSubscription(schema.subscription.currentLocationResponsed, {
    onSubscriptionData: ({ subscriptionData }) => {
      const { user, latLng } = subscriptionData.data.currentLocationResponsed;
      const m = markers.filter(
        (marker) => marker.user.username !== user.username
      );
      setLogs([
        `${moment
          .tz(new Date().valueOf(), "Asia/Hong_Kong")
          .format("YYYY-MM-DD HH:mm")}: @${user.username} at ${
          latLng.latitude
        }, ${latLng.longitude}`,
        ...logs,
      ]);
      setMarkers([...m, { ...latLng, message: [`@${user.username}`], user }]);
    },
  });

  const makeRequestCurrentLocation = async () => {
    setRefetching(true);
    await requestCurrentLocation();
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
            <Flex justify="space-between" align="center">
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="/drivers">Drivers</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>

              <IconButton
                aria-label="Refetch Locations"
                onClick={makeRequestCurrentLocation}
                isLoading={isRefetching}
                variant="ghost"
                icon={<RepeatIcon />}
              />
            </Flex>

            <Stack>
              <Text fontSize="2xl" color="gray.500">
                Logs
              </Text>
              <Divider />

              {logs.map((log) => (
                <>
                  <Text>{log}</Text>
                  <Divider />
                </>
              ))}
            </Stack>
          </GridItem>
          <GridItem colSpan={2}>
            <Map markers={[...markers]} />
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}
