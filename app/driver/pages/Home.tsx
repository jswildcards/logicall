import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import {
  Badge,
  Body,
  Button,
  Container,
  Content,
  Icon,
  Left,
  ListItem,
  Right,
  Text,
} from "native-base";
import { useMutation, useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import schema from "../utils/schema";
import NoData from "../components/NoData";
import FixedContainer from "../components/FixedContainer";
import HeavyBoxIcon from "../components/icons/HeavyBoxIcon";
import { mapStatusToColor } from "../utils/convert";

function Page() {
  const { loading, error, data } = useQuery(schema.query.me, {
    pollInterval: 500,
  });
  const [updateCurrentLocation] = useMutation(
    schema.mutation.updateCurrentLocation
  );
  const { getItem: globalCurrentLocation } = useAsyncStorage("currentLocation");
  const { getItem: globalTestMode } = useAsyncStorage("testMode");

  const updateServerLocation = (location) => {
    const { latitude, longitude } = location;

    updateCurrentLocation({
      variables: {
        input: { latitude: Number(latitude), longitude: Number(longitude) },
      },
    });
  };

  const updateLocation = async () => {
    const testMode = ((await globalTestMode()) ?? "false") === "true";

    if (testMode) {
      const { latitude, longitude } = JSON.parse(
        (await globalCurrentLocation()) ?? '{"latitude":"","longitude":""}'
      );
      updateServerLocation({ latitude, longitude });
    } else {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        updateServerLocation(coords);
      });

      navigator.geolocation.watchPosition(({ coords }) => {
        updateServerLocation(coords);
      });
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  if (loading) {
    return (
      <Container>
        <StatusBar />
        <Text>loading</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <StatusBar />
        <Text>{JSON.stringify(error)}</Text>
      </Container>
    );
  }

  if (!data.me.currentJobs?.length) {
    return (
      <Container>
        <StatusBar />
        <NoData
          icon={<HeavyBoxIcon height="30%" />}
          title="No Jobs Now!"
          subtitle="Do you want to get a job now?"
          button={
            <Button onPress={() => Actions.jobRequest()}>
              <Text>Get a Job</Text>
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <Container>
      <StatusBar />
      <Content>
        <FixedContainer>
          <ListItem itemDivider icon last>
            <Left>
              <Icon name="bicycle" ios="ios-bicycle" />
            </Left>
            <Body>
              <Text>Current Jobs</Text>
            </Body>
          </ListItem>

          {data.me.currentJobs.map((job) => (
            <ListItem
              key={job.jobId}
              noIndent
              onPress={() => Actions.jobDetail({ job })}
            >
              <Left>
                <Text>{job.order.orderId} </Text>
                <Badge style={mapStatusToColor(job.order.status)}>
                  <Text style={mapStatusToColor(job.order.status)}>
                    {job.order.status}
                  </Text>
                </Badge>
              </Left>
              <Right>
                <Icon name="arrow-forward" ios="ios-arrow-forward" />
              </Right>
            </ListItem>
          ))}
        </FixedContainer>
      </Content>
    </Container>
  );
}

export default Page;
