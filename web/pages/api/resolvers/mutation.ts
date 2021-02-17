import type { status as Status } from "@prisma/client";
import { Order, User } from "@prisma/client";
import {
  Cookie as CookieConfig,
  DurationLimit,
} from "../utils/config";
import { encrypt } from "../utils/crypto";
import token from "../utils/token";
import { Context } from "../utils/types";
import { setCookie } from "../utils/cookies";
import {
  CREATE_ORDER,
  REQUEST_NEW_JOB,
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
    sendLatLng,
    sendAddress,
  } = input;

  const { polylines, duration } = hereApi.routing(sendLatLng, receiveLatLng);

  const order = await prisma.order.create({
    data: {
      orderId: `${new Date().valueOf().toString(36)}-${
        auth.userId
      }-${receiverId}`.toUpperCase(),
      sender: { connect: { userId: auth.userId } },
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
  const result = await prisma.order.update({
    where: { orderId },
    data: { status, comments },
    include: { jobs: true },
  });

  if (status === "Delivered") {
    await prisma.job.update({
      where: {
        jobId: result.jobs[0].jobId,
      },
      data: {
        status: "Finished",
      },
    });
  }

  if (status === "Approved") {
    let driverDurationMapper = {};

    const locations = await redis
      .hgetall("location")
      .then((res) => Object.values(res).map((el: string) => JSON.parse(el)));

    locations.forEach(async (location) => {
      const me = await prisma.user.findUnique({
        where: location.user.userId,
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

        const { duration: firstDuration } = hereApi.routing(
          Object.values(location.latLng).join(","),
          firstOrder.receiveLatLng,
          firstOrder.status === "Collecting" ? [firstOrder.sendLatLng] : []
        );

        const { duration: lastDuration } = hereApi.routing(
          lastOrder.receiveAddress,
          result.sendLatLng
        );

        me.jobs.shift();
        const duration =
          me.jobs.reduce((prev, cur) => prev + cur.duration, 0) +
          firstDuration +
          lastDuration;

        // TODO: minutes to second/ms??
        if (duration < DurationLimit) {
          driverDurationMapper = {
            ...driverDurationMapper,
            [me.userId]: duration,
          };
        }
      } else {
        const { duration } = hereApi.routing(
          Object.values(location.latLng).join(","),
          result.sendLatLng
        );

        // TODO: minutes to second/ms??
        if (duration < DurationLimit) {
          driverDurationMapper = {
            ...driverDurationMapper,
            [me.userId]: duration,
          };
        }
      }
    });

    // TODO: Publish the calculated result and recommandation to driver (what parameters???)
    pubsub.publish(REQUEST_NEW_JOB, {});
    // TODO: setup 1 minute timer
    await new Promise((resolve) => setTimeout(resolve, 60000));
    // TODO: redis: find which drivers have accept the job, find the shortest duration and assign to him
  }

  pubsub.publish(UPDATE_ORDER_STATUS, {
    orderStatusUpdated: { ...result },
  });

  return result;
}

export async function createJob(
  _: any,
  { origin }: { origin: string },
  { prisma, auth, response }: Context
) {
  if (!auth?.userId || auth?.role !== "driver") {
    response.status(401);
    throw new Error("Unathorized");
  }

  const order = await prisma.order.findFirst({
    where: { status: "Approved" },
    orderBy: { createdAt: "asc" },
  });

  await prisma.order.update({
    where: { orderId: order.orderId },
    data: { status: "Collecting", comments: `Assigned to @${auth.username}` },
  });

  const { polylines, duration } = hereApi.routing(origin, order.sendLatLng, [
    order.receiveLatLng,
  ]);

  return prisma.job.create({
    data: {
      order: { connect: { orderId: order.orderId } },
      driver: { connect: { userId: auth.userId } },
      status: "Processing",
      polylines,
      duration,
    },
  });
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

  await redis.hset(
    "location",
    auth.username,
    JSON.stringify({ latLng: { latitude, longitude }, user: auth })
  );

  pubsub.publish(UPDATE_CURRENT_LOCATION, {
    currentLocationResponsed: { user: auth, latLng: { latitude, longitude } },
  });

  return { user: auth, latLng: { latitude, longitude } };
}

export default {
  signUp,
  signIn,
  signOut,
  createOrder,
  updateOrderStatus,
  createJob,
  updateCurrentLocation,
};
