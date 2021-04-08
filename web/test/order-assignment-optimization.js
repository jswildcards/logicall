const Axios = require("axios");
const locations = require("./data/hos-location.json");
const key = require("./key.json");

const coordinates = locations.regionArray.flatMap((regions) =>
  regions.district.flatMap((district) =>
    district.estates.map((estate) => estate.center)
  )
);

const randomCoordinates = () =>
  coordinates[Math.floor(Math.random() * coordinates.length)];

const hereApi = (via) =>
  Axios.get(
    `https://router.hereapi.com/v8/routes?transportMode=car&origin=22.111,114.111&destination=22.111,114.111${via
      .map((el) => `&via=${el}`)
      .join("")}&return=summary&apiKey=${key}`
  );

const { driverAmount, orderAmount, scale, testCaseNumber } = {
  driverAmount: 50,
  orderAmount: 150,
  scale: "Large",
  testCaseNumber: 9,
};

const convertHereApiResponse = (response) => {
  const {
    departure,
    arrival,
    summary: { duration },
  } = response;
  const { lat: dLat, lng: dLng } = departure.place.originalLocation;
  const { lat: aLat, lng: aLng } = arrival.place.originalLocation;

  return {
    from: [dLat, dLng],
    to: [aLat, aLng],
    duration,
    status: "Assigned",
  };
};

const driverInitialPositions = Array(driverAmount)
  .fill(0)
  .map(() => ({
    lastPosition: randomCoordinates(),
    totalDuration: 0,
    orders: [],
  }));

const initialOrders = Array(orderAmount)
  .fill(0)
  .map(() => [randomCoordinates(), randomCoordinates()]);

const initialDrivers = {
  optimized: [...driverInitialPositions],
  unoptimized: [...driverInitialPositions],
};

let removedOrders = [];

hereApi(initialOrders.flat())
  .then((res) =>
    res.data.routes[0].sections
      .filter((_, index) => index % 2 === 1)
      .map(convertHereApiResponse)
  )
  .catch(console.log)
  .then((orders) => {
    orders
      .reduce((driversPromise, order, orderId) => {
        return driversPromise.then(async (drivers) => {
          console.log(orderId);
          await new Promise(resolve => setTimeout(resolve, 200));

          const unoptimizedDriver = drivers.unoptimized[orderId % driverAmount];
          const response = await hereApi([
            unoptimizedDriver.lastPosition,
            order.from,
          ]).then((res) =>
            convertHereApiResponse(res.data.routes[0].sections[1])
          );

          if (!response) {
            removedOrders.push(orderId);
            order.status = "Removed";
            return driver;
          }

          const result = await hereApi(
            drivers.optimized.flatMap(({ lastPosition }) => [
              lastPosition,
              order.from,
            ])
          ).then((res) =>
            res.data.routes[0].sections
              .filter((_, index) => index % 2 === 1)
              .map(convertHereApiResponse)
          );

          // const result = responses.map(convertHereApiResponse);

          const { driverId, duration } = drivers.optimized.reduce(
            (shortestDuration, driver, id) => {
              const currentDuration = !result[id]
                ? Infinity
                : driver.totalDuration + result[id].duration + order.duration;
              if (currentDuration < shortestDuration.duration)
                return { driverId: id, duration: currentDuration };
              return shortestDuration;
            },
            {
              driverId: 0,
              duration: !result[0]
                ? Infinity
                : drivers.optimized[0].totalDuration +
                  result[0].duration +
                  order.duration,
            }
          );

          drivers.optimized[driverId] = {
            totalDuration: duration,
            lastPosition: order.to,
            orders: [
              ...drivers.optimized[driverId].orders,
              { id: orderId, routes: [result[driverId], order] },
            ],
          };

          drivers.unoptimized[orderId % driverAmount] = {
            totalDuration:
              unoptimizedDriver.totalDuration +
              response.duration +
              order.duration,
            lastPosition: order.to,
            orders: [
              ...unoptimizedDriver.orders,
              { id: orderId, routes: [response, order] },
            ],
          };

          return drivers;
        })
        .catch(console.log);
      }, Promise.resolve(initialDrivers))
      .then((result) => {
        console.log(`Test Case #${testCaseNumber}`);
        console.log(
          `${scale} Scale: ${driverAmount} Drivers, ${orders.length} Orders, ${
            orders.length - removedOrders.length
          } Assigned Orders\n`
        );
        console.log("Orders:");
        console.table(orders);
        console.log("\nDriver Assignment:\nOptimized Method:");
        console.table(
          result.optimized.map(({ totalDuration, orders }) => ({
            totalDuration,
            orderIds: JSON.stringify(orders.map(({ id }) => id)),
          }))
        );
        console.log(
          `Longest Duration: ${Math.max(
            ...result.optimized.map(({ totalDuration }) => totalDuration)
          )}`
        );
        console.log("\nUnoptimized Method:");
        console.table(
          result.unoptimized.map(({ totalDuration, orders }) => ({
            totalDuration,
            orderIds: JSON.stringify(orders.map(({ id }) => id)),
          }))
        );
        console.log(
          `Longest Duration: ${Math.max(
            ...result.unoptimized.map(({ totalDuration }) => totalDuration)
          )}`
        );
      })
      .catch(console.log);
  });
