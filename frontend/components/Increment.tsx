import React from "react";
import { Button } from "@material-ui/core";

// Redux: receive props mapped to states and dispatches
export default function Increment({ counter, increment }) {
  return (
    <>
      <Button onClick={() => increment()}>Add</Button>
      {counter}
    </>
  );
}
