/* eslint-disable no-loop-func */
import type { status as Status } from "@prisma/client";
import { Order, User } from "@prisma/client";
import {
  Cookie as CookieConfig,
  InitialDurationLimit,
  ExtraDurationLimit,
} from "../utils/config";
import { encrypt } from "../utils/crypto";
import token from "../utils/token";
import { Context } from "../utils/types";
import { setCookie } from "../utils/cookies";
import {
  CREATE_ORDER,
  REQUEST_NEW_JOB,
  RESPONSE_NEW_JOB,
  UPDATE_CURRENT_LOCATION,
  UPDATE_ORDER_STATUS,
} from "../utils/subscription-types";
import { mapStringToLatLng } from "../../../utils/convert";
import hereApi from "../utils/here-api";

export async function signUp(
  _: any,
  { input }: { input: User },
  { prisma, response }: Context
) {
  const data = { ...input, password: encrypt(input.password) };
  const user = await prisma.user.create({ data });
  setCookie(response, CookieConfig.token, await token.assign(user), {
    httpOnly: true,
    sameSite: "none",
  });
  return user;
}

export async function signIn(
  _: any,
  { input }: { input: User },
  { prisma, response }: Context
) {
  const encryptedPassword = encrypt(input.password);
  const user = await prisma.user.findUnique({
    where: { username: input.username },
  });

  if (user?.password === encryptedPassword && user?.role === input.role) {
    setCookie(response, CookieConfig.token, await token.assign(user), {
      httpOnly: true,
      sameSite: "none",
    });
    return user;
  }

  throw new Error("Your username/password is wrong. Please try again.");
}

export async function signOut(_parent: any, _args: any, { response }: Context) {
  setCookie(response, CookieConfig.token, "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "none",
  });
  return "Logout Success";
}

export async function createOrder(
  _: any,
  { input }: { input: Order },
  { auth, response, prisma, pubsub }: Context
) {
  if (!auth?.userId) {
    response.status(401);
    throw new Error("Unathorized");
  }

  const {
    receiverId,
    receiveAddress,
    receiveLatLng,
    senderId,
    sendLatLng,
    sendAddress,
  } = input;

  const { polylines, duration } = await hereApi.routing(
    sendLatLng,
    receiveLatLng
  );

  const order = await prisma.order.create({
    data: {
      orderId: `${new Date()
        .valueOf()
        .toString(36)}-${senderId}-${receiverId}`.toUpperCase(),
      creator: { connect: { userId: auth.userId } },
      sender: { connect: { userId: senderId } },
      receiver: { connect: { userId: receiverId } },
      receiveAddress,
      receiveLatLng,
      sendAddress,
      sendLatLng,
      status: "Pending",
      comments: `Created by @${auth.username}`,
      suggestedPolylines: polylines,
      estimatedDuration: duration,
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  const result = mapStringToLatLng(order);
  pubsub.publish(CREATE_ORDER, { orderCreated: result });
  return result;
}

export async function updateOrderStatus(
  _parent: any,
  {
    input: { orderId, status, comments },
  }: {
    input: {
      orderId: string;
      status: Status;
      comments: string;
    };
  },
  { prisma, pubsub, redis }: Context
) {
  const nextOrder = await prisma.order.update({
    where: { orderId },
    data: { status, comments },
    include: { jobs: true },
  });

  if (status === "Delivered") {
    await prisma.job.update({
      where: {
        jobId: nextOrder.jobs[0].jobId,
      },
      data: {
        status: "Finished",
      },
    });
  }

  pubsub.publish(UPDATE_ORDER_STATUS, {
    orderStatusUpdated: { ...nextOrder },
  });

  if (status === "Approved") {
    let driverRouteMapper = [];

    // get all online driver and their current location
    const locations = await redis
      .hgetall("location")
      .then((res) => Object.values(res).map((el: string) => JSON.parse(el)));

    const initialDriverRouteMapper = await Promise.all(
      locations.map(async (location) => {
        // find all processing jobs for the driver
        const me = await prisma.user.findUnique({
          where: { userId: location.user.userId },
          include: {
            jobs: {
              where: { status: "Processing" },
              include: { order: true },
              orderBy: { jobId: "asc" },
            },
          },
        });

        if (me.jobs.length > 0) {
          const firstOrder = me.jobs[0].order;
          const lastOrder = me.jobs[me.jobs.length - 1].order;

          // find the duration from current location to first order receive location
          // if the order is collecting, add the intermediate point for first order send location
          const { duration: firstDuration } = await hereApi.routing(
            Object.values(location.latLng).join(","),
            firstOrder.receiveLatLng,
            firstOrder.status === "Collecting" ? [firstOrder.sendLatLng] : []
          );

          // find the duration from last order receive location to current order send location
          const { polylines, duration: lastDuration } = await hereApi.routing(
            lastOrder.receiveLatLng,
            nextOrder.sendLatLng
          );

          me.jobs.shift();
          const duration =
            me.jobs.reduce((prev, cur) => prev + cur.duration, 0) +
            firstDuration +
            lastDuration;

          return { me, polylines, duration, lastDuration };
        }

        // find the duration of current location to current order send location
        const { polylines, duration } = await hereApi.routing(
          Object.values(location.latLng).join(","),
          nextOrder.sendLatLng
        );

        return { me, polylines, duration, lastDuration: duration };
      })
    );

    // find all drivers whose duration within the limit
    // if there are none, add extra time limit and find again.
    for (
      let durationLimit = InitialDurationLimit;
      driverRouteMapper.length <= 0;
      durationLimit += ExtraDurationLimit
    ) {
      driverRouteMapper = initialDriverRouteMapper.filter(
        ({ duration }) => duration <= durationLimit
      );
    }

    // TODO: Publish the calculated result and recommandation to driver (what parameters???)
    pubsub.publish(REQUEST_NEW_JOB, {
      newJobRequested: {
        driverIds: driverRouteMapper.map(({ me: { userId } }) => userId),
        order: nextOrder,
        driverRouteMapper,
      },
    });

    // TODO: setup 1 minute timer for driver to consider accept the job or not
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // TODO: redis: find which drivers have accept the job, find the shortest duration and assign to him
    // accepting the order using "responseNewJob" mutation
    const { success, failed } = await redis
      .hget("order", nextOrder.orderId)
      .then((res) => JSON.parse(res));

    const {
      user,
      polylines: suggestedPolylines,
      lastDuration: estimatedDuration,
    } = success;

    // update order status to "Collecting"
    const updatedOrder = await prisma.order.update({
      where: { orderId },
      data: {
        status: "Collecting",
        comments: `Assigned to @${user.username}`,
      },
    });

    // create a new job for this order
    await prisma.job.create({
      data: {
        order: { connect: { orderId } },
        driver: { connect: { userId: user.userId } },
        status: "Processing",
        polylines: JSON.stringify([
          ...JSON.parse(suggestedPolylines),
          ...JSON.parse(nextOrder.suggestedPolylines),
        ]),
        duration: estimatedDuration + nextOrder.estimatedDuration,
      },
    });

    // notify drivers who received and not received this job
    pubsub.publish(RESPONSE_NEW_JOB, {
      newJobResponsed: {
        driverIds: [user.userId, ...failed],
        success: user.userId,
        order: nextOrder,
      },
    });

    pubsub.publish(UPDATE_ORDER_STATUS, {
      orderStatusUpdated: { ...updatedOrder },
    });
  }

  return nextOrder;
}

export async function responseNewJob(
  _parent: any,
  {
    input: { lastDuration, duration, polylines, orderId },
  }: {
    input: {
      lastDuration: number;
      duration: number;
      polylines: string;
      orderId: string;
    };
  },
  { redis, auth, response }: Context
) {
  if (!auth?.userId || auth?.role !== "driver") {
    response.status(401);
    throw new Error("Unathorized");
  }

  const result = await redis
    .hget("order", orderId)
    .then((res) => JSON.parse(res || "{}"));

  let value = null;

  if (!result.success || duration < result.success.duration) {
    const failed = [
      ...(result.failed ?? []),
      result.success?.user?.userId,
    ].filter(Boolean);
    value = {
      success: { user: auth, duration, polylines, lastDuration },
      failed,
    };
  } else {
    const failed = [...result.failed, auth.userId];
    value = {
      success: result.success,
      failed,
    };
  }

  await redis.hset("order", orderId, JSON.stringify(value));
  return "true";
}

export async function updateCurrentLocation(
  _parent: any,
  { input: { latitude, longitude } },
  { auth, response, redis, pubsub }: Context
) {
  if (!auth?.userId) {
    response.status(401);
    throw new Error("Unathorized");
  }

  const currentLocationUpdated = {
    latLng: { latitude, longitude },
    user: auth,
    at: new Date().valueOf(),
  };

  await redis.hset(
    "location",
    auth.username,
    JSON.stringify(currentLocationUpdated)
  );

  pubsub.publish(UPDATE_CURRENT_LOCATION, { currentLocationUpdated });

  return currentLocationUpdated;
}

export default {
  signUp,
  signIn,
  signOut,
  createOrder,
  updateOrderStatus,
  responseNewJob,
  updateCurrentLocation,
};
