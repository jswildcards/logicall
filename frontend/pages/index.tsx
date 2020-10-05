import React from 'react';
import { Button, TextField, FormControl } from '@material-ui/core';
import Link from 'next/link';

export default class Home extends React.Component {
  signIn() {

  }

  render() {
    return (
      <div>
        <FormControl fullWidth>
          <TextField label="Username" />
        </FormControl>
        <FormControl fullWidth>
          <TextField label="Password" />
        </FormControl>
        <Button variant="contained" color="primary" onClick={() => this.signIn()}>Sign In</Button>
      </div>
    )
  }
}
