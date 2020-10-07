# logicall

## Project Guidelines

The idea is that your system has three interfaces business/client and driver. The business is probably web, the client is web or mobile, and the driver is mobile app.

You should allow for the entire delivery process – register new package, pick-up, delivery. You are free to choose your model. It can be bike messenger model where driver only has one package at a time, it could be that a driver goes out in morning and pick up and deliver (to make it more tricky new orders coming in can be assigned to drivers already out), or you can have depot (all deliveries are known in the morning and assigned to drivers available as to optimise time/driving).

The process of automatically assigning drivers/packages and optimising their route is important.

## Usage

### Clone Project

```bash
$ git clone https://github.com/jswildcards/logicall.git
# or clone this branch
$ git clone --single-branch -b development https://github.com/jswildcards/logicall.git

$ cd logicall
$ cp .env.example .env
```

### Build

#### Mac Terminal

```bash
$ sh ./build.sh
```

#### Windows Powershell

```bash
$ .\build.sh
```

When docker build is done, open http://localhost to view the homepage or open http://localhost/api/customers to start query some JSON results
