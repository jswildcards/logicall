import { Container, Content, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { StatusBar } from "react-native";
import HeaderNav from "../components/HeaderNav";
import schema from "../utils/schema";

function Page() {
  const { data: me, loading, error } = useQuery(schema.query.me);

  if(loading) {
    return <></>;
  }

  return (
    <Container>
      <StatusBar />
      <HeaderNav title="Scan Result" />
      <Content>
        <Text>{JSON.stringify(me.me.jobs[0].order)}</Text>
      </Content>
    </Container>
  );
}

export default Page;
