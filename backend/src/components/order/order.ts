export default interface IOrder {
  orderId?: string;
  sendCustomerId?: string | number;
  sendCustomerAddressId?: string | number;
  receiveCustomerId?: string | number;
  receiveCustomerAddressId?: string | number;
  status?: string;
  signUrl?: string;
  comments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
