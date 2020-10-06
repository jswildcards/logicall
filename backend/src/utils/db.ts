import mysql from "mysql2";
import { Database as DatabaseConfig } from "./config";

export default mysql.createConnection(DatabaseConfig).promise();
