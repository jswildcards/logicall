import ICustomer from "./customer";
import connection from "../../utils/db";

export async function getCustomers() {
  const sql = "SELECT * FROM customers";
  return (await connection.execute(sql))[0] as ICustomer[];
}

export async function getCustomerById({ customerId }: ICustomer) {
  const sql = "SELECT * FROM `customers` WHERE `customerId` = ?";
  return ((await connection.execute(sql, [customerId]))[0] as ICustomer[])?.[0];
}

export async function getCustomerByAuth({ username, password }: ICustomer) {
  const sql = "SELECT * FROM customers WHERE username = ? AND password = ?";
  return ((
    await connection.execute(sql, [username, password])
  )[0] as ICustomer[])?.[0];
}

export default {
  getCustomers,
  getCustomerById,
  getCustomerByAuth,
};
