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

Copy the environment variable from .env.example:

```bash
> cp ./web/.env.example ./web/.env
> cp ./app/customer/.env.example ./app/customer/.env
> cp ./app/driver/.env.example ./app/driver/.env
```

Check the IP address of you local machine, and update the field `EXPO_HOST` for both `./app/customer/.env` and `./app/driver/.env`.

Sign up for a free acount from [HERE Platform](https://developer.here.com/sign-up?create=Freemium-Basic&keepState=true&step=account), then create an API Key at HERE REST APIs. Copy the key to the field `HERE_API_KEY` of `./web/.env`.

### Build

#### Web Application

```bash
> ./build.sh test
```

When docker build is done, open http://localhost to view the homepage.

#### Mobile Application

First, create an Emulator from Android Studio, or prepare a mobile phone connected to the computer.

Note: You will need "Expo" app installed in your phone. Please see https://expo.io/client for more.

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

## Application Sign In Account

In the admin web application, use `heavybutterfly271` for username and `password` for password. Go to driver page or customer page to get the corresponding username. The password for all accounts is `password`.

Note that you cannot sign in an account for another role platform. For example, you cann sign in a `customer` account for `admin` web application.
