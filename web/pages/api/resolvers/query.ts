import { mapStringToLatLng } from "../../../utils/convert";
import { Context } from "../utils/types";

export async function users(
  _parent: any,
  { search }: { search: string },
  { auth, prisma }: Context
) {
  return prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ],
      role: "customer",
      userId: { not: auth.userId },
    },
  });
}

export async function drivers(
  _parent: any,
  _args: any,
  { prisma, redis }: Context
) {
  const locations = await redis
    .hgetall("location")
    .then((res) => Object.values(res).map((el: string) => JSON.parse(el)));

  return (await prisma.user.findMany({ where: { role: "driver" } })).map(
    (driver) => {
      const find = locations.find(
        (location) => location.user?.userId === driver.userId
      );

      return {
        ...driver,
        currentLocation: {
          status: find?.at ? "online" : "offline",
          at: find?.at,
          latLng: find?.latLng,
        },
      };
    }
  );
}

export async function customers(_parent: any, _args: any, { prisma }: Context) {
  return prisma.user.findMany({
    where: { role: "customer" },
    include: { sendOrders: true, receiveOrders: true },
  });
}

export async function user(
  _parent: any,
  { userId }: { userId: number },
  { prisma }: Context
) {
  return prisma.user.findUnique({
    where: { userId },
    include: {
      jobs: { include: { order: true } },
      sendOrders: { include: { sender: true, receiver: true } },
      receiveOrders: { include: { sender: true, receiver: true } },
    },
  });
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
        include: {
          sender: true,
          receiver: true,
          creator: true,
          jobs: { include: { driver: true } },
          logs: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { orderId: "desc" },
      },
      sendOrders: {
        include: {
          sender: true,
          receiver: true,
          creator: true,
          jobs: { include: { driver: true } },
          logs: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { orderId: "desc" },
      },
      jobs: {
        include: {
          driver: true,
          order: {
            include: {
              sender: true,
              receiver: true,
              logs: { orderBy: { createdAt: "desc" } },
            },
          },
        },
        orderBy: { status: "desc" },
      },
    },
  });

  const userMe = {
    ...result,
    jobs: result.jobs.map((job) => {
      return {
        ...job,
        order: mapStringToLatLng(job.order),
      };
    }),
  };

  return {
    ...userMe,
    currentJobs: userMe?.jobs?.filter((job) => job?.status === "Processing"),
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

  const final = { ...result, duration: null };

  if ((result.jobs?.[0]?.status ?? false) === "Finished") {
    final.duration = Math.floor(
      (result.logs
        .find((log) => log.status === "Delivered")
        .createdAt.valueOf() -
        result.logs
          .find((log) => log.status === "Collecting")
          .createdAt.valueOf()) /
        1000
    );
  }

  return mapStringToLatLng(final);
}

export default { users, drivers, user, customers, me, orders, order };
