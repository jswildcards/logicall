import { status as Status } from "@prisma/client";
import { Context, Page } from "../utils/types";

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
  { userId }: { userId: number },
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

  const result = await prisma.user.findUnique({
    where: { userId: auth.userId },
    include: {
      receiveOrders: {
        include: { sender: true, receiver: true },
      },
      sendOrders: {
        include: { sender: true, receiver: true },
      },
      jobs: {
        include: {
          driver: true,
          order: { include: { sender: true, receiver: true } },
        },
      },
    },
  });

  return {
    ...result,
    jobs: result.jobs.map((job) => {
      const [receiveLat, receiveLng] = job.order.receiveLatLng
        .split(",")
        .map(Number);
      const [sendLat, sendLng] = job.order.sendLatLng.split(",").map(Number);

      return {
        ...job,
        order: {
          ...job.order,
          receiveLatLng: { latitude: receiveLat, longitude: receiveLng },
          sendLatLng: { latitude: sendLat, longitude: sendLng },
        },
      };
    }),
  };
}

export async function orders(
  _parent: any,
  {
    input: { pagination, status },
  }: { input: { pagination: Page; status: Status } },
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
      jobs: { include: { driver: true } },
      logs: true,
    },
    where: {
      status,
    },
    orderBy: { orderId: "desc" },
    skip: (pagination.page - 1) * pagination.size,
    take: pagination.size,
  });

  const count = await prisma.order.count({ where: { status } });

  const result = {
    orders: results.map((order) => {
      const [receiveLat, receiveLng] = order.receiveLatLng
        .split(",")
        .map(Number);
      const [sendLat, sendLng] = order.sendLatLng.split(",").map(Number);

      return {
        ...order,
        receiveLatLng: { latitude: receiveLat, longitude: receiveLng },
        sendLatLng: { latitude: sendLat, longitude: sendLng },
      };
    }),
    count,
  };

  return result;
}

export default { users, user, me, orders };
