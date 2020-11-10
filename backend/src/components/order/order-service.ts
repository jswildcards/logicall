import { IPage } from "../../utils/paging";
import Order from "./order";

export async function getOrders(page: IPage) {
  return Order.findAll(page);
}

export async function getOrderById(orderId: string | number) {
  return Order.findByPk(orderId);
}

export default {
  getOrders,
  getOrderById,
};
