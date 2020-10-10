export default interface ICustomerAddress {
  customerAddressId?: string | number;
  customerId?: string | number;
  addressLine1?: string;
  addressLine2?: string;
  latitude?: string | number;
  longitude?: string | number;
  createdAt?: Date;
  updatedAt?: Date;
}
