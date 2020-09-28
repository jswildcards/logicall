import Model from "./model";

export default interface User extends Model {
  username?: string;
  password?: string;
}