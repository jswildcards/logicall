export default interface IEmployee {
  employeeId?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  phone?: string;
  jobTitle?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
