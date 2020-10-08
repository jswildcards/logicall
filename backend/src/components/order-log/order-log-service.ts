import { RowDataPacket } from "mysql2";
import connection from "../../utils/db";
import { IPage } from "../../utils/paging";
import IOrderLog from "./order-log";

export async function getOrderLogs({ offset, size }: IPage) {
  const sql = "SELECT * FROM `orderLogs` LIMIT ?, ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [offset, size])
  )[0] as IOrderLog[];
}
export async function getOrderLogsByOrderId(
  orderId: string | number,
  { offset, size }: IPage
) {
  const sql = "SELECT * FROM `orderLogs` WHERE `orderId` = ? LIMIT ?, ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [orderId, offset, size])
  )[0] as IOrderLog[];
}

export async function getOrderLogById(orderLogId: string | number) {
  const sql = "SELECT * FROM `orderLogs` WHERE `orderLogId` = ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [orderLogId])
  )[0]?.[0] as IOrderLog;
}

export default {
  getOrderLogs,
  getOrderLogsByOrderId,
  getOrderLogById,
};
