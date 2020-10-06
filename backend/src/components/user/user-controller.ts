import IUser from './user';
import { IPage } from '../../utils/interfaces';
import connection from '../../utils/db';

export async function getUsers() {
  const sql = 'SELECT * FROM users';
  const [ rows ] = await connection.execute(sql);
  return rows;
}

export async function getUsersByPage({ offset, size }: IPage) {
  const sql = 'SELECT * FROM users LIMIT ?, ?';
  const [ rows ] = await connection.execute(sql, [offset, size]);
  return rows;
}

export async function getUserById({ id }: IUser) {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const [ rows ] = await connection.execute(sql, [ id ]);
  return rows;
}

export async function getUserByUsernameAndPassword({ username, password }: IUser) {
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const [ rows ] = await connection.execute(sql, [ username, password ]);
  return rows;
}
