export default interface ICustomer {
  customerAddressId?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
