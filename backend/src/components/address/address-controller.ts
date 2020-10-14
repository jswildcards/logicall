import Express from "express";
import AddressService from "./address-service";
// import Address from "./address";
import { paging } from "../../utils/paging";

const type = "customer-address";

async function getAddresses(req: Express.Request, res: Express.Response) {
  const page = paging(req.query?.page);
  // const { customerId } = (req.query.filter as any) as Address;

  const addresses =
    // customerId
    //   ? await AddressService.getAddressesByCustomerId(customerId, page):
    await AddressService.getAddresses(page);

  res.json({
    data: addresses.map((address) => {
      const { addressId, ...attributes } = address.get();

      return {
        type,
        id: addressId,
        attributes,
        // TODO: relationships to be implemented
        relationships: null,
      };
    }),
  });
}

async function getAddressById(req: Express.Request, res: Express.Response) {
  const address = await AddressService.getAddressById(req.params.id);

  if (address) {
    const { addressId, ...attributes } = address.get();

    res.json({
      data: {
        type,
        id: addressId,
        attributes,
      },
    });

    return;
  }

  res.status(404).json({ error: "Requested resources not found." });
}

export { getAddresses, getAddressById };
export default { getAddresses, getAddressById };
