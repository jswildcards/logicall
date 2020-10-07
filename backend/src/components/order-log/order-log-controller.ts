import connection from "../../utils/db";
import IOrderLog from "./order-log";

export async function getOrderLogs() {
  const sql = "SELECT * FROM `orderLogs`";
  return (await connection.execute(sql))[0] as IOrderLog[];
}
export async function getOrderLogsByOrderId({ orderId }: IOrderLog) {
  const sql = "SELECT * FROM `orderLogs` WHERE `orderId` = ?";
  return (await connection.execute(sql, [orderId]))[0] as IOrderLog[];
}

export async function getOrderLogById({ orderLogId }: IOrderLog) {
  const sql = "SELECT * FROM `orderLogs` WHERE `orderLogId` = ?";
  return ((await connection.execute(sql, [orderLogId]))[0] as IOrderLog[])?.[0];
}

export default {
  getOrderLogs,
  getOrderLogsByOrderId,
  getOrderLogById,
};
