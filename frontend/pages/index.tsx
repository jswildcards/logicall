// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import React from "react";
import Link from "next/link";
import { AccessAlarm, ThreeDRotation } from "@material-ui/icons";
import { Button, FormControl, TextField } from "@material-ui/core";

// Redux: use Increment component
import Increment from "../containers/increment";
import User from "../containers/user";

interface IProps { }
interface IState {
  time: Date;
  value: string;
}

export default class Home extends React.Component<IProps, IState> {
  timeID: NodeJS.Timeout;

  constructor(props: Readonly<IProps>) {
    super(props);
    this.state = {
      time: new Date(),
      value: "",
    };
  }

  componentDidMount() {
    this.timeID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeID);
  }

  tick() {
    this.setState({ time: new Date() });
  }

  handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    this.setState({ value: e.target.value });
  }

  render() {
    const { time, value } = this.state;

    return (
      <div>
        <h4>
          The time is now
          {' '}
          {time.toLocaleString()}
        </h4>
        <FormControl fullWidth>
          <TextField
            type="text"
            value={value}
            label="Username"
            onChange={(e) => this.handleChange(e)}
          />
        </FormControl>
        <p>{value}</p>
        <AccessAlarm />
        <ThreeDRotation />
        <User />
        <Increment />
        <Link href="/clock" passHref>
          <Button variant="contained" color="primary">
            Clock
          </Button>
        </Link>
      </div>
    );
  }
}
