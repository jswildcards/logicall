import dotenv from "dotenv";

dotenv.config();

const {
  MYSQL_HOST,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  CRY_ALG,
  CRY_SECRET,
  JWT_ALG,
  JWT_SECRET,
} = process.env;

const Database = {
  host: MYSQL_HOST ?? "",
  user: MYSQL_USER ?? "",
  password: MYSQL_PASSWORD ?? "",
  database: MYSQL_DATABASE ?? "",
};

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

export { Cookie, Crypto, Database, Jwt, Page };
export default { Database, Crypto, Page, Jwt, Cookie };
