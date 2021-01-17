import { status as Status } from "@prisma/client";
import { mapStringToLatLng } from "../../../utils/convert";
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
      return {
        ...job,
        order: mapStringToLatLng(job.order),
      };
    }),
  };
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

  return prisma.order.findMany({
    include: {
      sender: true,
      receiver: true,
      jobs: { include: { driver: true } },
      logs: true,
    },
    orderBy: { orderId: "desc" },
  });
}

export async function order(
  _parent: any,
  { orderId }: { orderId: string },
  { prisma }: Context
) {
  const result = await prisma.order.findUnique({
    where: { orderId },
    include: {
      sender: true,
      receiver: true,
      jobs: { include: { driver: true } },
      logs: { orderBy: { orderLogId: "desc" } },
    },
  });

  if ((result.jobs?.[0]?.status ?? false) === "Finished") {
    result.duration =
      Math.floor((result.logs.find((log) => log.status === "Delivered").createdAt.valueOf() -
      result.logs.find((log) => log.status === "Collecting").createdAt.valueOf()) / 1000);
  }

  return mapStringToLatLng(result);
}

export default { users, user, me, orders, order };
