import express from "express";
import { getOrderLogs, getOrderLogById } from "./order-log-controller";

const router = express.Router();

router.get("/", getOrderLogs);
router.get("/:id", getOrderLogById);

export default router;
