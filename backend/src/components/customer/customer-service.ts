import { OkPacket, RowDataPacket } from "mysql2";
import ICustomer from "./customer";
import connection from "../../utils/db";
import { IPage } from "../../utils/paging";

export async function getCustomers({ offset, size }: IPage) {
  const sql = "SELECT * FROM customers LIMIT ?, ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [offset, size])
  )[0] as ICustomer[];
}

export async function getCustomerById(customerId: string | number) {
  const sql = "SELECT * FROM `customers` WHERE `customerId` = ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [customerId])
  )[0]?.[0] as ICustomer;
}

export async function getCustomerByAuth({ username, password }: ICustomer) {
  const sql = "SELECT * FROM customers WHERE username = ? AND password = ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [username, password])
  )[0]?.[0] as ICustomer;
}

export async function createCustomer({
  firstName,
  lastName,
  email,
  username,
  password,
  phone,
}: ICustomer) {
  const insertSql = `
    INSERT INTO \`customers\` 
    (\`firstName\`, \`lastName\`, \`email\`, \`username\`, \`password\`, \`phone\`) VALUES 
    (?, ?, ?, ?, ?, ?)
  `;
  const { insertId } = (
    await connection.execute<OkPacket>(insertSql, [
      firstName,
      lastName,
      email,
      username,
      password,
      phone,
    ])
  )[0];

  const selectSql = "SELECT * FROM `customers` WHERE customerId = ?";
  return (
    await connection.execute<RowDataPacket[]>(selectSql, [insertId])
  )[0]?.[0] as ICustomer;
}

export default {
  getCustomers,
  getCustomerById,
  getCustomerByAuth,
  createCustomer,
};
