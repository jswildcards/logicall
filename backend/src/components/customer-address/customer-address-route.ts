import express from "express";
import {
  getCustomerAddresses,
  getCustomerAddressById,
} from "./customer-address-controller";

const router = express.Router();

router.get("/", getCustomerAddresses);
router.get("/:id", getCustomerAddressById);

export default router;
