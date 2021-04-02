import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery, useSubscription } from "react-apollo";
import { RepeatIcon } from "@chakra-ui/icons";
import moment from "moment-timezone";
import { useRouter } from "next/router";
import AppBar from "../../components/appbar";
import schema from "../../utils/schema";
import DisplayName from "../../components/display-name";
import { filterUsers } from "../../utils/convert";

export default function Drivers() {
  const router = useRouter();
  const {
    data: drivers,
    loading: driversLoading,
    refetch: refetchDrivers,
  } = useQuery(schema.query.drivers);
  const [keywords, setKeywords] = useState("");
  const toast = useToast();
  const [isRefetching, setRefetching] = useState(false);
  const [marker, setMarker] = useState(undefined);
  const Map = useMemo(
    () =>
      dynamic(() => import("../../components/map"), {
        loading: () => <Text>Loading</Text>,
        ssr: false,
      }),
    []
  );
  useSubscription(schema.subscription.currentLocationUpdated, {
    onSubscriptionData: async () => {
      setRefetching(true);
      await refetchDrivers();
      setRefetching(false);
    },
  });

  const makeRequestCurrentLocation = async () => {
    setRefetching(true);
    await refetchDrivers();
    setRefetching(false);
    toast({
      position: "bottom-right",
      title: "Refetch Completed!",
      status: "success",
      duration: null,
      isClosable: true,
    });
  };

  const sortDrivers = (a: Record<string, any>, b: Record<string, any>) => {
    if (
      a.currentLocation.status === "offline" &&
      b.currentLocation.status === "online"
    )
      return 1;

    if (
      a.currentLocation.status === "online" &&
      b.currentLocation.status === "offline"
    )
      return -1;

    return a.driverId - b.driverId;
  };

  const getMarkers = () => {
    const hoveringDriver = drivers?.drivers?.find(
      (driver) => Number(driver.userId) === Number(marker)
    );

    if (hoveringDriver?.currentLocation?.status === "online") {
      return [
        {
          ...hoveringDriver.currentLocation.latLng,
          message: <DisplayName user={hoveringDriver} />,
        },
      ];
    }

    return drivers?.drivers
      ?.filter((driver) => driver.currentLocation.status === "online")
      ?.map((user) => ({
        ...user.currentLocation.latLng,
        message: <DisplayName user={user} useLink />,
      }));
  };

  if (driversLoading) {
    return <></>;
  }

  return (
    <>
      <AppBar />
      <Container maxW="full" p="0" h="calc(100vh - 100.8px)">
        <Grid maxW="full" h="100%" templateColumns="repeat(2,1fr)">
          <GridItem overflow="auto" p="3" colSpan={1}>
            <Flex justify="space-between" align="center">
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="/driver">Drivers</BreadcrumbLink>
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
              <Text fontSize="xl" color="gray.500">
                Filter Drivers
              </Text>
              <Text color="gray.500">Keywords</Text>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value.toLowerCase())}
                placeholder="Enter Keywords..."
              />

              <Divider />
              <Text color="gray.500">
                Updated at{" "}
                {moment
                  .tz(new Date().valueOf(), "Asia/Hong_Kong")
                  .format("YYYY-MM-DD HH:mm:ss")}
              </Text>

              <Divider />

              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Driver ID</Th>
                    <Th>Name</Th>
                    <Th>Status</Th>
                    <Th>Position</Th>
                    <Th>Updated At</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filterUsers(keywords, drivers.drivers)
                    ?.sort(sortDrivers)
                    ?.map(
                      ({
                        userId,
                        username,
                        firstName,
                        lastName,
                        currentLocation: { status, at, latLng },
                      }: Record<string, any>) => (
                        <Tr
                          key={username}
                          _hover={{ background: "gray.100", cursor: "pointer" }}
                          onClick={() => router.push(`/driver/${userId}`)}
                          onMouseEnter={() => setMarker(userId)}
                          onMouseLeave={() => setMarker(undefined)}
                        >
                          <Td>
                            <Text>{userId}</Text>
                          </Td>
                          <Td>
                            <DisplayName
                              user={{ firstName, lastName, username }}
                            />
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                status === "online" ? "green" : "red"
                              }
                            >
                              {status}
                            </Badge>
                          </Td>
                          <Td>
                            {status === "online" && (
                              <Text>
                                {`${latLng.latitude}, ${latLng.longitude}`}
                              </Text>
                            )}
                          </Td>
                          <Td>
                            {status === "online" && (
                              <Text>
                                {moment
                                  .tz(new Date(at).valueOf(), "Asia/Hong_Kong")
                                  .format("YYYY-MM-DD HH:mm:ss")}
                              </Text>
                            )}
                          </Td>
                        </Tr>
                      )
                    )}
                </Tbody>
              </Table>
            </Stack>
          </GridItem>
          <GridItem colSpan={1}>
            <Map markers={getMarkers()} />
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}
