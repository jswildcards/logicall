import { UserWhereUniqueInput } from "@prisma/client";
import { Context } from "../utils/types";

export async function users(
  _parent: any,
  { search }: { search: string },
  { auth, prisma }: Context,
) {
  return prisma.user.findMany({
    where: {
      username: { contains: search },
      userId: { not: auth.userId },
      followers: {
        none: {
          followerId: auth.userId,
        },
      },
    },
  });
}

export async function user(
  _parent: any,
  { userId }: UserWhereUniqueInput,
  { prisma }: Context,
) {
  return prisma.user.findOne({ where: { userId } });
}

export async function me(
  _parent: any,
  _args: any,
  { auth, prisma, response }: Context,
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

export async function addresses(
  _parent: any,
  { userId: customerId }: { userId: number },
  { prisma }: Context,
) {
  return prisma.address.findMany(
    { where: { customerId }, include: { User: true } },
  );
}

export default { users, user, me, addresses };
