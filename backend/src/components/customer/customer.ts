export default interface ICustomer {
  customerId?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
