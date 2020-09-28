import { Product, Page } from '../models';
import connection from '../modules/db';

export async function getProducts() {
  const sql = 'SELECT * FROM products';
  const [ rows ] = await connection.execute(sql);
  return rows;
}

export async function getProductsByPage({ offset, size }: Page) {
  const sql = 'SELECT * FROM products LIMIT ?, ?';
  const [ rows ] = await connection.execute(sql, [offset, size]);
  return rows;
}

export async function getProductById({ id }: Product) {
  const sql = 'SELECT * FROM products WHERE id = ?';
  const [ rows ] = await connection.execute(sql, [ id ]);
  return rows;
}
