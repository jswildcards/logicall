import express from "express";
import { getAddresses, getAddressById } from "./address-controller";

const router = express.Router();

router.get("/", getAddresses);
router.get("/:id", getAddressById);

export default router;
