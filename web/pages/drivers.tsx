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
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery, useSubscription } from "react-apollo";
import { RepeatIcon } from "@chakra-ui/icons";
import moment from "moment-timezone";
import AppBar from "../components/appbar";
import schema from "../utils/schema";

export default function Drivers() {
  const {
    data: locations,
    loading: locationsLoading,
    refetch: refetchCurrentLocations,
  } = useQuery(schema.query.currentLocations);
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
  useSubscription(schema.subscription.currentLocationUpdated, {
    onSubscriptionData: async () => {
      setRefetching(true);
      await refetchCurrentLocations();
      setRefetching(false);
    },
  });

  const makeRequestCurrentLocation = async () => {
    setRefetching(true);
    await refetchCurrentLocations();
    setRefetching(false);
    toast({
      position: "bottom-right",
      title: "Refetch Completed!",
      status: "success",
      duration: null,
      isClosable: true,
    });
  };

  if (locationsLoading) {
    return <></>;
  }

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

              <Text color="gray.500">
                at
                {" "}
                {moment
                  .tz(new Date().valueOf(), "Asia/Hong_Kong")
                  .format("YYYY-MM-DD HH:mm:ss")}
              </Text>

              <Divider />
              {locations?.currentLocations?.map(({ user, latLng }) => (
                <Text>
                  {`@${user.username} at ${latLng.latitude}, ${latLng.longitude}`}
                </Text>
              ))}
            </Stack>
          </GridItem>
          <GridItem colSpan={2}>
            <Map
              markers={locations?.currentLocations?.map(
                ({ user, latLng }) => ({
                  ...latLng,
                  message: `@${user.username}`,
                })
              )}
            />
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}
