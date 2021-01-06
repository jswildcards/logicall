import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Fab,
  H3,
  Icon,
  Text,
} from "native-base";
import { useMutation, useQuery } from "react-apollo";
import { Actions } from "react-native-router-flux";
import moment from "moment-timezone";
import schema from "../utils/schema";
import NoData from "../components/NoData";
import FixedContainer from "../components/FixedContainer";
import AvatarItem from "../components/AvatarItem";
import HeavyBoxIcon from "../components/icons/HeavyBoxIcon";

const styles = StyleSheet.create({
  col: {
    flex: 1,
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  header: {
    marginTop: 8,
    color: "#536DFE",
  },
  bold: {
    fontWeight: "bold",
  },
});

function Page() {
  const { loading, error, data, refetch } = useQuery(schema.query.me);
  const [createJob] = useMutation(schema.mutation.createJob);

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
        <Text>error</Text>
      </Container>
    );
  }

  if (
    !data.me.jobs?.length ||
    data.me.jobs.every(
      ({ status }: { status: string }) => status === "Finished"
    )
  ) {
    return (
      <Container>
        <StatusBar />
        <NoData
          icon={<HeavyBoxIcon height="30%" />}
          title="No Jobs Now!"
          subtitle="Do you want to get a job now?"
          button={(
            <Button onPress={() => createJob().then(refetch)}>
              <Text>Get a Job</Text>
            </Button>
          )}
        />
      </Container>
    );
  }

  return (
    <Container>
      <StatusBar />
      <Content>
        <FixedContainer pad>
          <H3 style={{ paddingTop: 12 }}>Current Job</H3>
          {data.me.jobs
            .filter((job) => job.status !== "Finished")
            .map((job) => (
              <Card transparent key={job.jobId}>
                <AvatarItem item={job.order.sender} />
                <CardItem>
                  <Body>
                    <Text>{job.order.status}</Text>
                    <Text note>
                      {`created ${moment
                        .tz(parseInt(job.order.createdAt), "Asia/Hong_Kong")
                        .format("YYYY-MM-DD HH:mm")}`}
                    </Text>
                  </Body>
                </CardItem>
                <CardItem footer>
                  <Button
                    transparent
                    iconRight
                    style={{ marginLeft: "auto" }}
                    onPress={() => Actions.map({ job })}
                  >
                    <Text>Detail</Text>
                    <Icon name="arrow-forward" />
                  </Button>
                </CardItem>
              </Card>
            ))}

          {/* <Fab /> */}
          {/* <Text>{JSON.stringify(data.me.receiveOrders)}</Text> */}
        </FixedContainer>
      </Content>
    </Container>
  );
}

export default Page;
