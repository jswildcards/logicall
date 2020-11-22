import { User } from "@prisma/client";
import { Cookie as CookieConfig } from "../utils/config";
import { encrypt } from "../utils/crypto";
import token from "../utils/token";
import { Context } from "../utils/types";
// import token from "../utils/token";

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

export default { signUp, signIn, signOut };
