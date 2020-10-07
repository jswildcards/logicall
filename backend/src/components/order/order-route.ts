import express from "express";
import { getOrders, getOrderById } from "./order-controller";

const router = express.Router();
const type = "orders";

router.get("/", async (_, res) => {
  const orders = await getOrders();

  res.json({
    data: orders.map((order) => {
      const { orderId, ...attributes } = order;

      return {
        type,
        id: orderId,
        attributes,
        // TODO: relationships to be implemented
        relationships: null,
      };
    }),
  });
});

router.get("/:id", async (req, res) => {
  const order = await getOrderById({ orderId: req.params.id });
  const { orderId, ...attributes } = order;

  res.json({
    data: {
      type,
      id: orderId,
      attributes,
    },
  });
});

export default router;
