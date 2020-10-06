// import { Product, Page } from '../models';
import IProduct from "./product";
import { IPage } from "../../utils/interfaces";
import connection from "../../utils/db";

export async function getProducts() {
  const sql = "SELECT * FROM products";
  const [rows] = await connection.execute(sql);
  return rows;
}

export async function getProductsByPage({ offset, size }: IPage) {
  const sql = "SELECT * FROM products LIMIT ?, ?";
  const [rows] = await connection.execute(sql, [offset, size]);
  return rows;
}

export async function getProductById({ id }: IProduct) {
  const sql = "SELECT * FROM products WHERE id = ?";
  const [rows] = await connection.execute(sql, [id]);
  return rows;
}
