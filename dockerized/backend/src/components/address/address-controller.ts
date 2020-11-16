import Express from "express";
import AddressService from "./address-service";
// import Address from "./address";
import { paging } from "../../utils/paging";
import { NotFound } from "../../utils/httpStatus";

async function getAddresses(req: Express.Request, res: Express.Response) {
  const page = paging(req.query?.page);
  // const { customerId } = (req.query.filter as any) as Address;

  const addresses =
    // customerId
    //   ? await AddressService.getAddressesByCustomerId(customerId, page):
    await AddressService.getAddresses(page);

  res.json(addresses);
}

async function getAddressById(req: Express.Request, res: Express.Response) {
  const address = await AddressService.getAddressById(req.params.id);

  if (!address) {
    NotFound(res);
    return;
  }

  res.json(address);
}

export { getAddressById, getAddresses };
export default { getAddresses, getAddressById };
