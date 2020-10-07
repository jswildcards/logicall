import IEmployee from "./employee";
import connection from "../../utils/db";

export async function getEmployees() {
  const sql = "SELECT * FROM employees";
  return (await connection.execute(sql))[0] as IEmployee[];
}

export async function getEmployeeById({ employeeId }: IEmployee) {
  const sql = "SELECT * FROM `employees` WHERE `employeeId` = ?";
  return ((await connection.execute(sql, [employeeId]))[0] as IEmployee[])?.[0];
}

export async function getEmployeeByAuth({ username, password }: IEmployee) {
  const sql = "SELECT * FROM employees WHERE username = ? AND password = ?";
  return ((
    await connection.execute(sql, [username, password])
  )[0] as IEmployee[])?.[0];
}

export default {
  getEmployees,
  getEmployeeById,
  getEmployeeByAuth,
};
