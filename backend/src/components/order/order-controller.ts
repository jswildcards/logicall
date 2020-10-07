import connection from "../../utils/db";
import IOrder from "./order";

export async function getOrders() {
  const sql = "SELECT * FROM `orders`";
  return (await connection.execute(sql))[0] as IOrder[];
}

export async function getOrdersBySendCustomerId({ sendCustomerId }: IOrder) {
  const sql = "SELECT * FROM `orders` WHERE `sendCustomerId` = ?";
  return (await connection.execute(sql, [sendCustomerId]))[0] as IOrder[];
}

export async function getOrdersByReceiveCustomerId({
  receiveCustomerId,
}: IOrder) {
  const sql = "SELECT * FROM `orders` WHERE `receiveCustomerId` = ?";
  return (await connection.execute(sql, [receiveCustomerId]))[0] as IOrder[];
}

export async function getOrderById({ orderId }: IOrder) {
  const sql = "SELECT * FROM `orders` WHERE `orderId` = ?";
  return ((await connection.execute(sql, [orderId]))[0] as IOrder[])?.[0];
}

export default {
  getOrders,
  getOrdersBySendCustomerId,
  getOrdersByReceiveCustomerId,
  getOrderById,
};
