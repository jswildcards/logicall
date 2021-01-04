import type { Prisma, status as Status } from "@prisma/client";
import { Order, User } from "@prisma/client";
import { Cookie as CookieConfig } from "../utils/config";
import { encrypt } from "../utils/crypto";
import token from "../utils/token";
import { Context } from "../utils/types";
import { setCookie } from "../utils/cookies";

async function findDepotByAddressId(addressId: number, prisma) {
  const { district } = await prisma.address.findUnique({
    where: { addressId },
  });
  return prisma.depot.findFirst({ where: { district } });
}

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

export async function addFriend(
  _parent: any,
  { userId }: Prisma.UserWhereUniqueInput,
  { auth, prisma, response }: Context
) {
  if (!auth?.userId) {
    response.status(401);
    throw new Error("Unathorized");
  }

  await prisma.follow.create({
    data: {
      follower: { connect: { userId: auth.userId } },
      followee: { connect: { userId } },
    },
  });

  const result = await prisma.user.findUnique({
    where: { userId: auth.userId },
    include: {
      receiveOrders: true,
      sendOrders: true,
      followees: {
        include: { followee: true },
      },
    },
  });

  return result;
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

  const { receiverId, sendAddressId, receiveAddressId } = input;
  const sendDepot = await findDepotByAddressId(sendAddressId, prisma);
  const receiveDepot = await findDepotByAddressId(receiveAddressId, prisma);

  return prisma.order.create({
    data: {
      orderId: `${new Date().valueOf().toString(36)}-${
        auth.userId
      }-${receiverId}`.toUpperCase(),
      sender: { connect: { userId: auth.userId } },
      receiver: { connect: { userId: receiverId } },
      senderAddress: { connect: { addressId: sendAddressId } },
      receiverAddress: { connect: { addressId: receiveAddressId } },
      sendDepot: { connect: { depotId: sendDepot.depotId } },
      receiveDepot: { connect: { depotId: receiveDepot.depotId } },
      status: "Pending",
    },
  });
}

export async function updateOrderStatus(
  _parent: any,
  { orderId, status }: { orderId: string; status: Status },
  { prisma }: Context
) {
  return prisma.order.update({
    where: { orderId },
    data: { status },
  });
}

export default {
  signUp,
  signIn,
  signOut,
  addFriend,
  createOrder,
  updateOrderStatus,
};
