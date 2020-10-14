import dotenv from "dotenv";

dotenv.config();

const {
    MYSQL_HOST,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  CRY_ALG,
  CRY_SECRET,
} = process.env;

const Database = {
  host: MYSQL_HOST ?? "",
  user: MYSQL_USER ?? "",
  password: MYSQL_PASSWORD ?? "",
  database: MYSQL_DATABASE ?? "",
};

const Crypto = {
  algorithm: CRY_ALG,
  secret: CRY_SECRET,
};

const Page = {
  number: 1,
  size: 20,
};

export { Database, Crypto, Page };
export default { Database, Crypto, Page };
