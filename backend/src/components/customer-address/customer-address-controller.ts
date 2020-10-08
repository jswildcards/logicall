import Express from "express";
import CustomerAddressService from "./customer-address-service";
import ICustomerAddress from "./customer-address";
import { paging } from "../../utils/paging";

const type = "customer-address";

async function getCustomerAddresses(
  req: Express.Request,
  res: Express.Response
) {
  const page = paging(req.query?.page);
  const { customerId } = req.query.filter as ICustomerAddress;

  const customerAddresses = customerId
    ? await CustomerAddressService.getCustomerAddressesByCustomerId(
        customerId,
        page
      )
    : await CustomerAddressService.getCustomerAddresses(page);

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
}

async function getCustomerAddressById(
  req: Express.Request,
  res: Express.Response
) {
  const customerAddress = await CustomerAddressService.getCustomerAddressById(
    req.params.id
  );
  const { customerAddressId, ...attributes } = customerAddress;

  res.json({
    data: {
      type,
      id: customerAddressId,
      attributes,
    },
  });
}

export { getCustomerAddresses, getCustomerAddressById };
export default { getCustomerAddresses, getCustomerAddressById };
