import express from "express";
import { getOrders, getOrderById } from "./order-controller";

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);

export default router;
