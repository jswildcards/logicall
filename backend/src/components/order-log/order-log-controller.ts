import Express from "express";
import { paging } from "../../utils/paging";
import OrderLogService from "./order-log-service";

const type = "orderLogs";

async function getOrderLogs(req: Express.Request, res: Express.Response) {
  const page = paging(req.query?.page);
  const orderLogs = await OrderLogService.getOrderLogs(page);

  res.json({
    data: orderLogs.map((orderLog) => {
      const { orderLogId, ...attributes } = orderLog.get();

      return {
        type,
        id: orderLogId,
        attributes,
        // TODO: relationships to be implemented
        relationships: null,
      };
    }),
  });
}
async function getOrderLogById(req: Express.Request, res: Express.Response) {
  const orderLog = await OrderLogService.getOrderLogById(req.params.id);

  if (orderLog) {
    const { orderLogId, ...attributes } = orderLog.get();

    res.json({
      data: {
        type,
        id: orderLogId,
        attributes,
      },
    });
    return;
  }

  res.status(404).json({ error: "Requested resources not found." });
}

export { getOrderLogs, getOrderLogById };
export default { getOrderLogs, getOrderLogById };
