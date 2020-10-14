import Express from "express";
import { paging } from "../../utils/paging";
import OrderService from "./order-service";

const type = "orders";

async function getOrders(req: Express.Request, res: Express.Response) {
  const page = paging(req.query?.page);
  const orders = await OrderService.getOrders(page);

  res.json({
    data: orders.map((order) => {
      const { orderId, ...attributes } = order.get();

      return {
        type,
        id: orderId,
        attributes,
        // TODO: relationships to be implemented
        relationships: null,
      };
    }),
  });
}

async function getOrderById(req: Express.Request, res: Express.Response) {
  const order = await OrderService.getOrderById(req.params.id);

  if (order) {
    const { orderId, ...attributes } = order.get();

    res.json({
      data: {
        type,
        id: orderId,
        attributes,
      },
    });
    return;
  }

  res.status(404).json({ error: "Requested resources not found." });
}

export { getOrders, getOrderById };
export default { getOrders, getOrderById };
