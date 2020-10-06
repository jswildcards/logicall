// import { Product, Page } from '../models';
import Product from './product';
import { Page } from '../../utils/interfaces';
import connection from '../../utils/db';

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
