import React from "react";
import { useMutation, useSubscription } from "react-apollo";
import schema from "../utils/schema";

function Page() {
  useSubscription(schema.subscription.newJobRequested);
  useSubscription(schema.subscription.newJobResponsed);
  useMutation(schema.mutation.responseNewJob);

  return <></>;
}

export default Page;
