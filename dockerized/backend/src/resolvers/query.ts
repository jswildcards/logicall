import { UserWhereUniqueInput } from "@prisma/client";
import { Context } from "../utils/types";

export async function users(
  _parent: any,
  { search }: { search: string },
  { prisma }: Context
) {
  console.log("hio");
  return prisma.user.findMany({ where: { username: { contains: search } } });
}

export async function user(
  _parent: any,
  { userId }: UserWhereUniqueInput,
  { prisma }: Context
) {
  return prisma.user.findOne({ where: { userId } });
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

  return prisma.user.findOne({
    where: { userId: auth.userId },
    include: {
      receiveOrders: true,
      sendOrders: true,
      deliverOrders: true,
      followees: {
        include: { followee: true },
      },
      followers: {
        include: { follower: true },
      },
    },
  });
}

export default { users, user, me };
