import Axios from "axios";
import express from "express";
import { getCustomers, getCustomerById } from "./customer-controller";

const router = express.Router();
const type = "customers";

router.get("/", async (_, res) => {
  const customers = await getCustomers();

  res.json({
    data: customers.map((customer) => {
      const { customerId, ...attributes } = customer;

      return {
        type,
        id: customerId,
        attributes,
        // TODO: relationships to be implemented
        relationships: null,
      };
    }),
  });
});

router.get("/:id", async (req, res) => {
  const customer = await getCustomerById({ customerId: req.params.id });
  const { customerId, ...attributes } = customer;

  res.json({
    data: {
      type,
      id: customerId,
      attributes,
    },
  });
});

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
