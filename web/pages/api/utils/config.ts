import dotenv from "dotenv";

dotenv.config();

const {
  CRY_ALG,
  CRY_SECRET,
  JWT_ALG,
  JWT_SECRET,
  HERE_API_KEY,
  REDIS_HOST,
} = process.env;

export const Crypto = {
  algorithm: CRY_ALG ?? "sha256",
  secret: CRY_SECRET ?? "secret",
};

export const Jwt = {
  algorithm: JWT_ALG ?? "HS256",
  secret: JWT_SECRET ?? "secret",
};

export const Page = {
  number: 1,
  size: 20,
};

export const Cookie = {
  token: "LOGICALL_JWT",
};

// 15 minutes -> second
export const InitialDurationLimit = 15 * 60;
export const ExtraDurationLimit = 5 * 60;

export const HereApiKey = HERE_API_KEY;
export const RedisHost = REDIS_HOST;

export default {
  Crypto,
  Page,
  Jwt,
  Cookie,
  HereApiKey,
  RedisHost,
  InitialDurationLimit,
  ExtraDurationLimit,
};
