import { Container, Content } from "native-base";
import React from "react";
import { useMutation, useQuery } from "react-apollo";
import { StatusBar, View } from "react-native";
import { Actions } from "react-native-router-flux";
import QRScanner from "../components/QRScanner";
import schema from "../utils/schema";

function Page() {
  const { data: me, refetch } = useQuery(schema.query.me);
  const [updateOrderStatus] = useMutation(schema.mutation.updateOrderStatus);

  // useEffect(() => {
  // });

  return (
    <Container>
      <StatusBar />
      <View style={{ flex: 1 }}>
        <QRScanner
          onBarCodeRead={({ data }) => {data = JSON.parse(data)
            console.log({
              input: {
                ...data,
                comments: `${data.comments} @${me.me.username}`,
              },
            });
            updateOrderStatus({
              variables: {
                input: {
                  ...data,
                  comments: `${data.comments} @${me.me.username}`,
                },
              },
            })
              .then(refetch)
              .then(Actions.scanResult);
          }}
        />
      </View>
    </Container>
  );
}

export default Page;
