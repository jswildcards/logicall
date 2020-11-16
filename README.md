# logicall

![GitHub](https://img.shields.io/github/license/jswildcards/logicall)

This is a logistics system project using Docker, React, React Native, Node.js, MySQL, and NGINX.

## Project Guidelines

The system has three interfaces: business/client and driver. The business is probably web, the client is ~~web or~~ mobile, and the driver is mobile app.

The entire system should follow the entire delivery process: register new package, pick-up, and delivery. There are several models that can be chosen. It can be bike messenger model where driver only has one package at a time, it could be that a driver goes out in morning and pick up and deliver (to make it more tricky new orders coming in can be assigned to drivers already out), or there are depots (all deliveries are known in the morning and assigned to drivers available as to optimise time/driving).

The process of automatically assigning drivers/packages and optimising their route is important.

## Progress

- [ ] Implementing

  - [x] Database
    - [x] SQL Script
  - [ ] Backend (~~RESTful API~~ GraphQL)
    - [x] Database Model
    - [ ] Controllers
    - [ ] Routes
  - [ ] Frontend (Admin Web App)
    - [x] Sign In Page
    - [ ] Delivery Management Page
    - [ ] Driver Monitor Page
  - [ ] Mobile (Customer)
    - [x] Sign In Page
    - [x] Sign Up Page
  - [ ] Mobile (Driver)

- [ ] Testing
  - [ ] Backend
    - [ ] Unit test
    - [ ] API test
  - [ ] Frontend
    - [ ] Unit test
    - [ ] Integration test
    - [ ] e2e test
  - [ ] Mobile (Customer)
  - [ ] Mobile (Driver)

## Usage

### Clone Project

```bash
$ git clone https://github.com/jswildcards/logicall.git
$ cd logicall/dockerized
$ cp .env.example .env
```

### Build

#### Production Build

```bash
# For macOS
$ sh ./build.sh
# For Windows Powershell
$ .\build.sh
```

When docker build is done, open http://localhost to view the homepage.

#### Development Build

The development build is mainly for the process when backend or frontend is not completely developed and provide a database connection to backend for testing.

```bash
# For macOS
$ sh ./build.dev.sh
# For Windows Powershell
$ .\build.dev.sh

$ cd backend
$ yarn
$ yarn start
```

After backend server is started, the API is ready for query.

#### Mobile

Please refer to [Expo documentation](https://docs.expo.io/workflow/expo-cli/).
