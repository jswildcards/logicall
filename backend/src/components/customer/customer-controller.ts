import Express from "express";
import { encrypt } from "../../utils/crypto";
import { paging } from "../../utils/paging";
import CustomerService from "./customer-service";

const type = "customers";

async function getCustomers(req: Express.Request, res: Express.Response) {
  const page = paging(req.query?.page);
  const customers = await CustomerService.getCustomers(page);

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
}

async function getCustomerById(req: Express.Request, res: Express.Response) {
  const customer = await CustomerService.getCustomerById(req.params.id);
  const { customerId, ...attributes } = customer;

  res.json({
    data: {
      type,
      id: customerId,
      attributes,
    },
  });
}

async function createCustomer(req: Express.Request, res: Express.Response) {
  const customerInput = req.body;
  customerInput.password = encrypt(customerInput.password ?? "");
  customerInput.phone = customerInput.phone ?? "";
  const customer = await CustomerService.createCustomer(customerInput);
  const { customerId, ...attributes } = customer;

  res.json({
    data: {
      type,
      id: customerId,
      attributes,
    },
  });
}

export { getCustomers, getCustomerById, createCustomer };
export default { getCustomers, getCustomerById, createCustomer };
