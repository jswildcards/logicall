import Express from "express";
import { NotFound } from "../../utils/httpStatus";
import { paging } from "../../utils/paging";
import OrderLogService from "./order-log-service";

async function getOrderLogs(req: Express.Request, res: Express.Response) {
  const page = paging(req.query?.page);
  const orderLogs = await OrderLogService.getOrderLogs(page);
  res.json(orderLogs);
}
async function getOrderLogById(req: Express.Request, res: Express.Response) {
  const orderLog = await OrderLogService.getOrderLogById(req.params.id);

  if (!orderLog) {
    NotFound(res);
    return;
  }

  res.json(orderLog);
}

export { getOrderLogById, getOrderLogs };
export default { getOrderLogs, getOrderLogById };
