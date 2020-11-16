import jwt from "jsonwebtoken";
import { Jwt as JwtConfig } from "./config";

const { secret, algorithm } = JwtConfig;

export function assign(payload: string | object) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secret,
      { algorithm: algorithm as jwt.Algorithm, expiresIn: "7d" },
      (err, encoded) => {
        if (err) reject(err);
        resolve(encoded);
      },
    );
  });
}

export function verify(token: string) {
  return new Promise((resolve, reject) =>
    jwt.verify(
      token,
      secret,
      { algorithms: [algorithm] as jwt.Algorithm[] },
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      },
    )
  );
}

export async function refresh(token: string) {
  const payload = (await verify(token)) as Record<string, any>;
  delete payload.iat;
  delete payload.exp;
  delete payload.nbf;
  delete payload.jti;
  return assign(payload);
}

export default { assign, verify, refresh };
