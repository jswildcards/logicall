// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import React from "react";

interface IProps {}
interface IState {
  time: Date;
}

export default class Clock extends React.Component<IProps, IState> {
  timeID: NodeJS.Timeout;

  constructor(props: Readonly<IProps>) {
    super(props);
    this.state = {
      time: new Date(),
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
  
  render() {
    return (
      <div>
        <h4>The time is now { this.state.time.toLocaleString() }</h4>
      </div>
    );
  }
}
