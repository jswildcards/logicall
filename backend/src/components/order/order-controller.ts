import Express from "express";
import { NotFound } from "../../utils/httpStatus";
import { paging } from "../../utils/paging";
import OrderService from "./order-service";

async function getOrders(req: Express.Request, res: Express.Response) {
  const page = paging(req.query?.page);
  const orders = await OrderService.getOrders(page);
  res.json(orders);
}

async function getOrderById(req: Express.Request, res: Express.Response) {
  const order = await OrderService.getOrderById(req.params.id);

  if (!order) {
    NotFound(res);
    return;
  }

  res.json(order);
}

export { getOrderById, getOrders };
export default { getOrders, getOrderById };
