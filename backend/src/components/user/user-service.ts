import User from "./user";
import { IPage } from "../../utils/paging";
import Address from "../address/address";
import Order from "../order/order";

function getUsers(page: IPage) {
  return User.findAll({
    ...page,
    include: [
      { model: Address, as: "addresses" },
      { model: Order, as: "sendOrders" },
      { model: Order, as: "receiveOrders" },
      { model: Order, as: "deliverOrders" },
    ],
  });
}

function getUserById(userId: string | number) {
  return User.findByPk(userId);
}

function getUserByAuth({ username, password }: User) {
  return User.findAll({ where: { username, password } });
}

function createUser(user: User) {
  return User.create(user);
}

function deleteUser(user: User) {
  return user.destroy();
}

export { getUsers, getUserById, getUserByAuth, createUser, deleteUser };
export default {
  getUsers,
  getUserById,
  getUserByAuth,
  createUser,
  deleteUser,
};
