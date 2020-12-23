// utils/cookies.ts

import { CookieSerializeOptions, serialize } from "cookie";
import { NextApiResponse } from "next";

/**
 * This sets `cookie` using the `res` object
 */

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {},
) => {
  const stringValue = typeof value === "object"
    ? `j:${JSON.stringify(value)}`
    : String(value);

  const cookieOptions = { ...options };

  if ("maxAge" in options) {
    cookieOptions.expires = new Date(Date.now() + options.maxAge);
    cookieOptions.maxAge /= 1000;
  }

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), cookieOptions));
};

export default { setCookie };
