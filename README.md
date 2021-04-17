# LogiCall

## Installation Guide

### Prerequisite

- [Docker v20.10.5](https://www.docker.com/get-started)
- [Node v12.18.4](https://nodejs.org/en/)
- Npm v6.14.6

Install Expo using Npm:

```bash
> npm install --global expo-cli
```

### Build

#### Web Application

```bash
> ./build.sh test
```

When docker build is done, open http://localhost to view the homepage.

#### Mobile Application

First, create an Emulator from Android Studio, or prepare a mobile phone connected to the computer.

Then, run the following command:

For Customer App:

```bash
> cd ./app/customer
> yarn start
```

For Driver App:

```bash
> cd ./app/driver
> yarn start
```

Then, press `a` in the command prompt to open app in Android Phone or `i` to open app in iPhone.

## Sign In Account

In the admin web application, use `heavybutterfly271` for username and `password` for password. Go to driver page or customer page to get the corresponding username. The password for all accounts is `password`.
