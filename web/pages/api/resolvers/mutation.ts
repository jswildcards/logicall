import type { status as Status } from "@prisma/client";
import { Order, User } from "@prisma/client";
import Axios from "axios";
import { Cookie as CookieConfig, HereApiKey } from "../utils/config";
import { encrypt } from "../utils/crypto";
import token from "../utils/token";
import { Context } from "../utils/types";
import { setCookie } from "../utils/cookies";
import {
  REQUEST_CURRENT_LOCATION,
  RESPONSE_CURRENT_LOCATION,
} from "../utils/subscription-types";

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
  { auth, response, prisma }: Context
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

  return prisma.order.create({
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
    },
  });
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
  { prisma }: Context
) {
  return prisma.order.update({
    where: { orderId },
    data: { status, comments },
  });
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
    data: { status: "Assigned", comments: `Assigned to @${auth.username}` },
  });

  const { polyline } = (
    await Axios.get(
      `https://router.hereapi.com/v8/routes?transportMode=car&origin=${origin}&via=${order.sendLatLng}&destination=${order.receiveLatLng}&return=polyline,summary&apiKey=${HereApiKey}`
    )
  ).data.routes[0].sections[0];

  return prisma.job.create({
    data: {
      order: { connect: { orderId: order.orderId } },
      driver: { connect: { userId: auth.userId } },
      status: "Created",
      polyline,
    },
  });
}

export function requestCurrentLocation(_parent, _args, { pubsub }: Context) {
  pubsub.publish(REQUEST_CURRENT_LOCATION, {
    currentLocationRequested: "true",
  });
  return "true";
}

export function responseCurrentLocation(
  _parent,
  { input: { latitude, longitude } },
  { pubsub, auth, response }: Context
) {
  if (!auth?.userId) {
    response.status(401);
    throw new Error("Unathorized");
  }

  pubsub.publish(RESPONSE_CURRENT_LOCATION, {
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
  requestCurrentLocation,
  responseCurrentLocation,
};
