import User from "./user";
import { IPage } from "../../utils/paging";
import Address from "../address/address";

export async function getUsers(page: IPage) {
  // const sql = "SELECT * FROM users LIMIT ?, ?";
  // return (
  //   await connection.execute<RowDataPacket[]>(sql, [offset, size])
  // )[0] as User[];

  return User.findAll({
    ...page,
    include: [{ model: Address, as: "addresses" }],
  });
}

export async function getUserById(userId: string | number) {
  return User.findByPk(userId);
}

export async function getUserByAuth({ username, password }: User) {
  return User.findAll({ where: { username, password } });
}

export default {
  getUsers,
  getUserById,
  getUserByAuth,
};
