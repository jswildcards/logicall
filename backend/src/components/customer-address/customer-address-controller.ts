import ICustomerAddress from "./customer-address";
import connection from "../../utils/db";

export async function getCustomerAddresses() {
  const sql = "SELECT * FROM customerAddresses";
  return (await connection.execute(sql))[0] as ICustomerAddress[];
}

export async function getCustomerAddressesByCustomerId({
  customerId,
}: ICustomerAddress) {
  const sql = "SELECT * FROM customerAddresses WHERE customerId = ?";
  return (await connection.execute(sql, [customerId]))[0] as ICustomerAddress[];
}

export async function getCustomerAddressById({
  customerAddressId,
}: ICustomerAddress) {
  const sql = "SELECT * FROM `customerAddresses` WHERE `customerAddressId` = ?";
  return ((
    await connection.execute(sql, [customerAddressId])
  )[0] as ICustomerAddress[])?.[0];
}

export default {
  getCustomerAddresses,
  getCustomerAddressesByCustomerId,
  getCustomerAddressById,
};
