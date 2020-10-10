import Axios from "axios";
import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
} from "./customer-controller";

const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);

router.get("/:id/relationships/customer-addresses", async (req, res) => {
  res.json({
    ...(
      await Axios.get(
        `/api/customer-addresses?filter[customerId]=${req.params.id}`
      )
    ).data,
  });
});

export default router;
