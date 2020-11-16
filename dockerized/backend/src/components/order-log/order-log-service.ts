import { IPage } from "../../utils/paging";
import OrderLog from "./order-log";

export async function getOrderLogs(page: IPage) {
  return OrderLog.findAll(page);
}
// export async function getOrderLogsByOrderId(
//   orderId: string | number,
//   { offset, limit: size }: IPage
// ) {
//   const sql = "SELECT * FROM `orderLogs` WHERE `orderId` = ? LIMIT ?, ?";
//   return (
//     await connection.execute<RowDataPacket[]>(sql, [orderId, offset, size])
//   )[0] as OrderLog[];
// }

export async function getOrderLogById(orderLogId: string | number) {
  return OrderLog.findByPk(orderLogId);
}

export default {
  getOrderLogs,
  // getOrderLogsByOrderId,
  getOrderLogById,
};
