import express from "express";
import ICustomerAddress from "./customer-address";
import {
  getCustomerAddresses,
  getCustomerAddressById,
  getCustomerAddressesByCustomerId,
} from "./customer-address-controller";

const router = express.Router();
const type = "customer-address";

router.get("/", async (req, res) => {
  const { customerId } = req.query.filter as ICustomerAddress;

  const customerAddresses = customerId
    ? await getCustomerAddressesByCustomerId({
        customerId: customerId.toString(),
      })
    : await getCustomerAddresses();

  res.json({
    data: customerAddresses.map((customerAddress) => {
      const { customerAddressId, ...attributes } = customerAddress;

      return {
        type,
        id: customerAddressId,
        attributes,
        // TODO: relationships to be implemented
        relationships: null,
      };
    }),
  });
});

router.get("/:id", async (req, res) => {
  const customerAddress = await getCustomerAddressById({
    customerAddressId: req.params.id,
  });
  const { customerAddressId, ...attributes } = customerAddress;

  res.json({
    data: {
      type,
      id: customerAddressId,
      attributes,
    },
  });
});

export default router;
