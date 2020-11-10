import Address from "./address";
import { IPage } from "../../utils/paging";
import User from "../user/user";

export async function getAddresses(page: IPage) {
  return Address.findAll({
    ...page,
    include: [{ model: User, as: "customer" }],
  });
}

// export async function getAddressesByCustomerId(
//   customerId: string | number,
//   page: IPage
// ) {
//   return Address.findAll({
//     where: { customerId },
//     ...page,
//     include: [{ model: User, as: "customer" }],
//   });
// }

export async function getAddressById(addressId: string | number) {
  return Address.findByPk(addressId, {
    include: [{ model: User, as: "customer" }],
  });
}

export default {
  getAddresses,
  // getAddressesByCustomerId,
  getAddressById,
};
