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

const Crypto = {
  algorithm: CRY_ALG ?? "sha256",
  secret: CRY_SECRET ?? "secret",
};

const Jwt = {
  algorithm: JWT_ALG ?? "HS256",
  secret: JWT_SECRET ?? "secret",
};

const Page = {
  number: 1,
  size: 20,
};

const Cookie = {
  token: "LOGICALL_JWT",
};

const HereApiKey = HERE_API_KEY;
const redisHost = REDIS_HOST;

export { Cookie, Crypto, Jwt, Page, HereApiKey, redisHost };
export default { Crypto, Page, Jwt, Cookie, HereApiKey, redisHost };
