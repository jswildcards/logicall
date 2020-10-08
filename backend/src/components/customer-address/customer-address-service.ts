import { RowDataPacket } from "mysql2";
import ICustomerAddress from "./customer-address";
import connection from "../../utils/db";
import { IPage } from "../../utils/paging";

export async function getCustomerAddresses({ offset, size }: IPage) {
  const sql = "SELECT * FROM customerAddresses LIMIT ?, ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [offset, size])
  )[0] as ICustomerAddress[];
}

export async function getCustomerAddressesByCustomerId(
  customerId: string | number,
  { offset, size }: IPage
) {
  const sql = "SELECT * FROM customerAddresses WHERE customerId = ? LIMIT ?, ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [customerId, offset, size])
  )[0] as ICustomerAddress[];
}

export async function getCustomerAddressById(
  customerAddressId: string | number
) {
  const sql = "SELECT * FROM `customerAddresses` WHERE `customerAddressId` = ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [customerAddressId])
  )[0]?.[0] as ICustomerAddress;
}

export default {
  getCustomerAddresses,
  getCustomerAddressesByCustomerId,
  getCustomerAddressById,
};
