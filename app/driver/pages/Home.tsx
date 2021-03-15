import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import {
  Badge,
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  H3,
  Icon,
  Left,
  ListItem,
  Right,
  Text,
} from "native-base";
import { useMutation, useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
// import * as Location from 'expo-location';
import moment from "moment-timezone";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import schema from "../utils/schema";
import NoData from "../components/NoData";
import FixedContainer from "../components/FixedContainer";
import AvatarItem from "../components/AvatarItem";
import HeavyBoxIcon from "../components/icons/HeavyBoxIcon";
import { mapStatusToColor } from "../utils/convert";

function Page() {
  const { loading, error, data } = useQuery(schema.query.me);
  const [updateCurrentLocation] = useMutation(
    schema.mutation.updateCurrentLocation
  );
  const {
    getItem: globalCurrentLocation,
    setItem: setGlobalCurrentLocation,
  } = useAsyncStorage("currentLocation");

  const updateLocation = async () => {
    const { latitude, longitude } = JSON.parse(
      (await globalCurrentLocation()) ?? '{"latitude":"","longitude":""}'
    );
    updateCurrentLocation({
      variables: {
        input: { latitude: Number(latitude), longitude: Number(longitude) },
      },
    });
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
            <ListItem key={job.jobId} noIndent onPress={() => Actions.jobDetail({ job })}>
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
