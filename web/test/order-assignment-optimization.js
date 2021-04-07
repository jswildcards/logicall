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

const hereApi = (origin, destination) =>
  Axios.get(
    `https://router.hereapi.com/v8/routes?transportMode=car&origin=${origin}&destination=${destination}&return=summary&apiKey=${key}`
  );

const { driverAmount, orderAmount, scale } = {
  driverAmount: 5,
  orderAmount: 3,
  scale: "Small",
};

const convertHereApiResponse = (response) => {
  const {
    departure,
    arrival,
    summary: { duration },
  } = response.data.routes[0].sections[0];
  const { lat: dLat, lng: dLng } = departure.place.originalLocation;
  const { lat: aLat, lng: aLng } = arrival.place.originalLocation;

  return {
    from: [dLat, dLng],
    to: [aLat, aLng],
    duration,
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

Promise.all(initialOrders.map((order) => hereApi(order[0], order[1])))
  .then((res) => res.map(convertHereApiResponse))
  .then((orders) => {
    orders
      .reduce((driversPromise, order, orderId) => {
        return driversPromise.then(async (drivers) => {
          const responses = await Promise.all(
            drivers.optimized.map((driver) =>
              hereApi(driver.lastPosition, order.from)
            )
          );

          const result = responses.map(convertHereApiResponse);

          const { driverId, duration } = drivers.optimized.reduce(
            (shortestDuration, driver, id) => {
              const currentDuration =
                driver.totalDuration + result[id].duration + order.duration;
              if (currentDuration < shortestDuration.duration)
                return { driverId: id, duration: currentDuration };
              return shortestDuration;
            },
            {
              driverId: 0,
              duration:
                drivers.optimized[0].totalDuration +
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

          const unoptimizedDriver = drivers.unoptimized[orderId % driverAmount];
          const response = convertHereApiResponse(await hereApi(unoptimizedDriver.lastPosition, order.from));
          drivers.unoptimized[orderId % driverAmount] = {
            totalDuration: unoptimizedDriver.totalDuration + response.duration + order.duration,
            lastPosition: order.to,
            orders: [
              ...unoptimizedDriver.orders,
              { id: orderId, routes: [response, order] },
            ],
          }

          return drivers;
        });
      }, Promise.resolve(initialDrivers))
      .then((result) => console.log(JSON.stringify(result)));
  });
