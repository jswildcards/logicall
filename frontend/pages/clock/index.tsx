// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import React from "react";
import Link from 'next/link';
import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

interface IProps {}
interface IState {
  time: Date;
  value: string;
}

export default class Clock extends React.Component<IProps, IState> {
  timeID: NodeJS.Timeout;

  constructor(props: Readonly<IProps>) {
    super(props);
    this.state = {
      time: new Date(),
      value: ''
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

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ value: e.target.value });
  }
  
  render() {
    return (
      <div>
        <h4>The time is now { this.state.time.toLocaleString() }</h4>
        <input type="text" value={this.state.value} onChange={(e) => this.handleChange(e)} />
        <p>{this.state.value}</p>
        <AccessAlarm />
        <ThreeDRotation />
        <Link href="/">Home</Link>
      </div>
    );
  }
}
