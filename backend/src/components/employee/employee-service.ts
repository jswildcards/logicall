import { RowDataPacket } from "mysql2";
import IEmployee from "./employee";
import connection from "../../utils/db";
import { IPage } from "../../utils/paging";

export async function getEmployees({ offset, size }: IPage) {
  const sql = "SELECT * FROM employees LIMIT ?, ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [offset, size])
  )[0] as IEmployee[];
}

export async function getEmployeeById(employeeId: string | number) {
  const sql = "SELECT * FROM `employees` WHERE `employeeId` = ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [employeeId])
  )[0]?.[0] as IEmployee;
}

export async function getEmployeeByAuth({ username, password }: IEmployee) {
  const sql = "SELECT * FROM employees WHERE username = ? AND password = ?";
  return (
    await connection.execute<RowDataPacket[]>(sql, [username, password])
  )[0]?.[0] as IEmployee;
}

export default {
  getEmployees,
  getEmployeeById,
  getEmployeeByAuth,
};
