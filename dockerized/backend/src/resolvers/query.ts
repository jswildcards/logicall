import { UserWhereUniqueInput } from "@prisma/client";
import { Context } from "../utils/types";

export async function users(_parent: any, _args: any, { prisma }: Context) {
  return prisma.user.findMany();
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

  const data = await prisma.user.findOne({
    where: { userId: auth.userId },
    include: {
      receiveOrders: true,
      sendOrders: true,
      deliverOrders: true,
      following: true,
    },
  });

  const result = {
    ...data,
    followings: data!.following.map(async (friend) => {
      const following = await prisma.user.findOne({
        where: { userId: friend.receiverId },
        include: {
          receiveOrders: true,
          sendOrders: true,
          deliverOrders: true,
          following: true,
        },
      });

      return following;
    }),
  };

  return result;
}

export default { users, user, me };
