// import Head from 'next/head'
import React from 'react'
import Link from 'next/link';
// import styles from '../styles/Home.module.css'

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <h3>Hello</h3>
        <Link href="/clock">Clock</Link>
      </div>
    )
  }
}
