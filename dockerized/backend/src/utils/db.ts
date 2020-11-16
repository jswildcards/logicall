import { Sequelize } from "sequelize";
import { Database as DatabaseConfig } from "./config";

const { host, user, password, database } = DatabaseConfig;

const connection = new Sequelize(database, user, password, {
  dialect: "mysql",
  logging: false,
  host,
});

export { connection };
export default connection;
