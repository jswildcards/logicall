import { RowDataPacket } from "mysql2";
import connection from "../../utils/db";
import { IPage } from "../../utils/paging";
import IOrder from "./order";

export async function getOrders({ offset, size }: IPage) {
  const sql = "SELECT * FROM `orders` LIMIT ?, ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [offset, size])
  )[0] as IOrder[];
}

export async function getOrdersBySendCustomerId(
  sendCustomerId: string | number,
  { offset, size }: IPage
) {
  const sql = "SELECT * FROM `orders` WHERE `sendCustomerId` = ? LIMIT ?, ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [
      sendCustomerId,
      offset,
      size,
    ])
  )[0] as IOrder[];
}

export async function getOrdersByReceiveCustomerId(
  receiveCustomerId: string | number,
  { offset, size }: IPage
) {
  const sql = "SELECT * FROM `orders` WHERE `receiveCustomerId` = ? LIMIT ?, ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [
      receiveCustomerId,
      offset,
      size,
    ])
  )[0] as IOrder[];
}

export async function getOrderById(orderId: string | number) {
  const sql = "SELECT * FROM `orders` WHERE `orderId` = ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [orderId])
  )[0]?.[0] as IOrder;
}

export default {
  getOrders,
  getOrdersBySendCustomerId,
  getOrdersByReceiveCustomerId,
  getOrderById,
};
