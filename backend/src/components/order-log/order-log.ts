export default interface IOrderLog {
  orderLogId?: string | number;
  orderId?: string;
  status?: string;
  comments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
