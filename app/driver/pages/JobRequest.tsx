import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  List,
  ListItem,
  Text,
  Toast,
} from "native-base";
import React, { useState } from "react";
import { useMutation, useQuery, useSubscription } from "react-apollo";
import { StatusBar } from "react-native";
import FixedContainer from "../components/FixedContainer";
import EmptyIcon from "../components/icons/EmptyIcon";
import NoData from "../components/NoData";
import { mapSecondsToHoursFormat } from "../utils/convert";
import schema from "../utils/schema";

function Page() {
  const { data, refetch } = useQuery(schema.query.me);
  const [jobs, setJobs] = useState<any[]>([]);

  // TODO: subscription variables
  useSubscription(schema.subscription.newJobRequested, {
    variables: { driverId: Number(data.me.userId) },
    onSubscriptionData: ({ subscriptionData }) => {
      setJobs([...jobs, subscriptionData.data.newJobRequested]);
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
            {jobs.map((job) => {
              const myJob = job.driverRouteMapper.find(
                ({ me: { userId } }) => userId === data.me.userId
              );
              const totalDuration =
                job.order.estimatedDuration + myJob.lastDuration;
              return (
                <Card transparent key={job.order.orderId}>
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
                  <CardItem footer>
                    <Button
                      onPress={() => {
                        setJobs([
                          ...jobs.filter(
                            (o) => o.order.orderId !== job.order.orderId
                          ),
                        ]);
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
