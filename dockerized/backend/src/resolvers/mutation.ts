import { User, UserWhereUniqueInput } from "@prisma/client";
import { Cookie as CookieConfig } from "../utils/config";
import { encrypt } from "../utils/crypto";
import token from "../utils/token";
import { Context } from "../utils/types";

export async function signUp(
  _: any,
  { input }: { input: User },
  { prisma, response }: Context,
) {
  const data = { ...input, password: encrypt(input.password) };
  const user = await prisma.user.create({ data });
  response.cookie(CookieConfig.token, await token.assign(user), {
    httpOnly: true,
  });
  return user;
}

export async function signIn(
  _: any,
  { input }: { input: User },
  { response, prisma }: Context,
) {
  const encryptedPassword = encrypt(input.password);
  const user = await prisma.user.findOne({
    where: { username: input.username },
  });

  if (user?.password === encryptedPassword && user?.role === input.role) {
    response.cookie(CookieConfig.token, await token.assign(user), {
      httpOnly: true,
    });
    return user;
  }

  throw new Error("Your username/password is wrong. Please try again.");
}

export async function signOut(_parent: any, _args: any, { response }: Context) {
  response.clearCookie(CookieConfig.token);
  return "Logout Success";
}

export async function addFriend(
  _parent: any,
  { userId }: UserWhereUniqueInput,
  { auth, prisma, response }: Context,
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

  const result = await prisma.user.findOne({
    where: { userId: auth.userId },
    include: {
      receiveOrders: true,
      sendOrders: true,
      deliverOrders: true,
      followees: {
        include: { followee: true },
      },
    },
  });

  return result;
}

export default { signUp, signIn, signOut, addFriend };
