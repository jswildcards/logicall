import { UserWhereUniqueInput } from "@prisma/client";
import { Context } from "../utils/types";

export async function users(
  _parent: any,
  { search }: { search: string },
  { auth, prisma }: Context
) {
  return prisma.user.findMany({
    where: {
      username: { contains: search, mode: "insensitive" },
      role: "customer",
      userId: { not: auth.userId },
    },
  });
}

export async function user(
  _parent: any,
  { userId }: UserWhereUniqueInput,
  { prisma }: Context
) {
  return prisma.user.findUnique({ where: { userId } });
}

export async function me(
  _parent: any,
  _args: any,
  { auth, prisma, response }: Context
) {
  if (!auth?.userId) {
    response.status(401);
    throw new Error("Unathorized");
  }

  return prisma.user.findUnique({
    where: { userId: auth.userId },
    include: {
      receiveOrders: {
        include: { sender: true, receiver: true },
      },
      sendOrders: {
        include: { sender: true, receiver: true },
      },
      driverOrders: {
        include: { sender: true, receiver: true },
      },
    },
  });
}

export async function orders(
  _parent: any,
  _args: any,
  { prisma, auth, response }: Context
) {
  if (!auth?.userId || auth?.role !== "admin") {
    response.status(401);
    throw new Error("Unathorized");
  }

  const results = await prisma.order.findMany({
    include: {
      sender: true,
      receiver: true,
      driver: true,
      logs: true,
    },
  });

  return results.map((order) => {
    const [receiveLat, receiveLng] = order.receiveLatLng.split(",").map(Number);
    const [sendLat, sendLng] = order.sendLatLng.split(",").map(Number);

    return {
      ...order,
      receiveLatLng: { latitude: receiveLat, longitude: receiveLng },
      sendLatLng: { latitude: sendLat, longitude: sendLng },
    };
  });
}

export default { users, user, me, orders };
