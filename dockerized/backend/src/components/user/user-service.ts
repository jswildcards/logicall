import User from "./user";
import { IPage } from "../../utils/paging";
import Address from "../address/address";
import Order from "../order/order";

const include = [
  { model: Address, as: "addresses" },
  { model: Order, as: "sendOrders" },
  { model: Order, as: "receiveOrders" },
  { model: Order, as: "deliverOrders" },
];

function getUsers(page: IPage) {
  return User.findAll({ ...page, include });
}

function getUserById(userId: string | number) {
  return User.findByPk(userId, { include });
}

function getUserByAuth({ username, password }: User) {
  return User.findOne({ where: { username, password }, include });
}

function createUser(user: User) {
  return User.create(user);
}

// TODO: Test Update User Function
function updateUser(id: string | number, user: User) {
  return User.update(user, { where: { id } });
}

function deleteUser(user: User) {
  return user.destroy({ logging: true });
}

export {
  createUser,
  deleteUser,
  getUserByAuth,
  getUserById,
  getUsers,
  updateUser,
};
export default {
  getUsers,
  getUserById,
  getUserByAuth,
  createUser,
  updateUser,
  deleteUser,
};
