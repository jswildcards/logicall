import { User, UserWhereUniqueInput } from "@prisma/client";
import { Cookie as CookieConfig } from "../utils/config";
import jwt from "../utils/token";
import { Context } from "../utils/types";

export async function users(_parent: any, _args: any, { prisma }: Context) {
  // const token = request.cookies[CookieConfig.token];
  // const payload = await jwt.verify(token) as User;

  // if (payload.role === "admin") {
  return prisma.user.findMany();
  // }

  // response.status(401);
  // throw new Error("Unathorized");
}

export async function user(
  _parent: any,
  { userId }: UserWhereUniqueInput,
  { prisma }: Context,
) {
  // const token = request.cookies[CookieConfig.token];
  // const payload = await jwt.verify(token) as User;

  // if (payload.role === "admin" || payload.userId === userId) {
  return prisma.user.findOne({ where: { userId } });
  // }

  // response.status(401);
  // throw new Error("Unathorized");
}

export async function me(
  _parent: any,
  _args: any,
  { prisma, request, response }: Context,
) {
  const token = request.cookies[CookieConfig.token];

  if (!token) {
    response.status(401);
    throw new Error("Unathorized");
  }

  const payload = (await jwt.verify(token)) as User;

  if (!payload?.userId) {
    response.status(401);
    throw new Error("Unathorized");
  }

  return prisma.user.findOne({
    where: { userId: payload.userId },
    include: { receiveOrders: true, sendOrders: true, deliverOrders: true },
  });
}

export default { users, user, me };
