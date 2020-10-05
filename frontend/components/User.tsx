import React from 'react';
import { Button, TextField } from '@material-ui/core';
import user from '../reducers/user';

// Redux: receive props mapped to states and dispatches
export default function Increment({ user, signIn }) {
  return (
    <>
      <TextField onChange={(e) => signIn({ name: e.target.value})} />
      <br />
      <TextField onChange={(e) => signIn({ password: e.target.value})} />
      <br />
      {user.name}
      <br />
      {user.password}
      <br />
    </>
  );
}
