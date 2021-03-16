import moment from "moment-timezone";
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Icon,
  Left,
  List,
  ListItem,
  Text,
  Toast,
} from "native-base";
import React, { useState } from "react";
import { useMutation, useQuery, useSubscription } from "react-apollo";
import { StatusBar } from "react-native";
import { Actions } from "react-native-router-flux";
import FixedContainer from "../components/FixedContainer";
import EmptyIcon from "../components/icons/EmptyIcon";
import NoData from "../components/NoData";
import { mapSecondsToHoursFormat } from "../utils/convert";
import schema from "../utils/schema";

function Page() {
  const { data, refetch } = useQuery(schema.query.me);
  const [jobs, setJobs] = useState<any[]>([]);

  const getValidJob = () => {
    const ms = new Date().valueOf();
    return jobs.map((job) => job.expiredAt > ms);
  };

  const removeExpired = async (orderId) => {
    await new Promise((resolve) => setTimeout(resolve, 60000));
    setJobs([...getValidJob().filter((job) => job.order.orderId !== orderId)]);
  };

  // TODO: subscription variables
  useSubscription(schema.subscription.newJobRequested, {
    variables: { driverId: Number(data.me.userId) },
    onSubscriptionData: ({ subscriptionData }) => {
      const newJob = subscriptionData.data.newJobRequested;
      setJobs([...getValidJob(), newJob]);
      removeExpired(newJob.order.orderId);
    },
  });
  useSubscription(schema.subscription.newJobResponsed, {
    variables: { driverId: Number(data.me.userId) },
    onSubscriptionData: ({ subscriptionData }) => {
      const response = subscriptionData.data.newJobResponsed;
      const success = Number(response.success) === Number(data.me.userId);

      if (success) refetch();

      Toast.show({
        text: `${response.order.orderId}: ${success ? "success" : "fail"}`,
        buttonText: "Okay",
        duration: 6000,
      });
    },
  });

  const [responseNewJob] = useMutation(schema.mutation.responseNewJob);

  if (jobs.length <= 0) {
    return (
      <Container>
        <StatusBar />
        <NoData
          icon={<EmptyIcon height="30%" />}
          title="No Job Request Currently"
          subtitle="Please wait for new job request."
        />
      </Container>
    );
  }

  // TODO: responseNewJob variables
  return (
    <Container>
      <StatusBar />
      <Content>
        <FixedContainer>
          <List>
            <ListItem itemDivider icon last>
              <Left>
                <Icon
                  style={{ transform: [{ rotate: "90deg" }] }}
                  name="log-in"
                  ios="ios-log-in"
                />
              </Left>
              <Body>
                <Text>Job Requests</Text>
              </Body>
            </ListItem>

            {jobs.map((job) => {
              const myJob = job.driverRouteMapper.find(
                ({ me: { userId } }) => userId === data.me.userId
              );
              const totalDuration =
                job.order.estimatedDuration + myJob.lastDuration;
              return (
                <Card key={job.order.orderId}>
                  <CardItem>
                    <Body>
                      <Text note>Order ID</Text>
                      <Text>{job.order.orderId}</Text>
                    </Body>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text note>From</Text>
                      <Text>{job.order.sendAddress}</Text>
                    </Body>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text note>To</Text>
                      <Text>{job.order.receiveAddress}</Text>
                    </Body>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text note>Estimated Duration</Text>
                      <Text>{mapSecondsToHoursFormat(totalDuration)}</Text>
                    </Body>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text note>Expired At</Text>
                      <Text>
                        {moment
                          .tz(Number(job.expiredAt), "Asia/Hong_Kong")
                          .format("YYYY-MM-DD HH:mm")}
                      </Text>
                    </Body>
                  </CardItem>
                  <CardItem
                    style={{ display: "flex", justifyContent: "flex-end" }}
                    footer
                  >
                    <Button
                      bordered
                      info
                      onPress={() => {
                        Actions.map({
                          job: {
                            order: { ...job.order },
                            polylines: JSON.stringify([
                              ...JSON.parse(myJob.polylines),
                              ...JSON.parse(job.order.suggestedPolylines),
                            ]),
                          },
                        });
                      }}
                    >
                      <Text>Map</Text>
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onPress={() => {
                        setJobs([]);
                        responseNewJob({
                          variables: {
                            input: {
                              duration: myJob.duration,
                              lastDuration: myJob.lastDuration,
                              polylines: myJob.polylines,
                              orderId: job.order.orderId,
                            },
                          },
                        });
                      }}
                    >
                      <Text>Accept</Text>
                    </Button>
                  </CardItem>
                </Card>
              );
            })}
          </List>
        </FixedContainer>
      </Content>
    </Container>
  );
}

export default Page;
