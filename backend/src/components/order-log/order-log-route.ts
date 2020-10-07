import express from "express";
import { getOrderLogs, getOrderLogById } from "./order-log-controller";

const router = express.Router();
const type = "orderLogs";

router.get("/", async (_, res) => {
  const orderLogs = await getOrderLogs();

  res.json({
    data: orderLogs.map((orderLog) => {
      const { orderLogId, ...attributes } = orderLog;

      return {
        type,
        id: orderLogId,
        attributes,
        // TODO: relationships to be implemented
        relationships: null,
      };
    }),
  });
});

router.get("/:id", async (req, res) => {
  const orderLog = await getOrderLogById({ orderLogId: req.params.id });
  const { orderLogId, ...attributes } = orderLog;

  res.json({
    data: {
      type,
      id: orderLogId,
      attributes,
    },
  });
});

export default router;
