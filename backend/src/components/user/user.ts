import { Association, DataTypes, Model } from "sequelize";
import connection from "../../utils/db";
import Address from "../address/address";
import Order from "../order/order";

class User extends Model {
  public userId?: string | number;
  public firstName?: string;
  public lastName?: string;
  public email?: string;
  public username?: string;
  public password?: string;
  public phone?: string;
  public role?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date;

  public readonly addresses?: Address[];
  public readonly sendOrders?: Order[];
  public readonly receiveOrders?: Order[];
  public readonly deliverOrders?: Order[];
  public static associations: {
    addresses: Association<User, Address>;
    sendOrders: Association<User, Order>;
    receiveOrders: Association<User, Order>;
    deliverOrders: Association<User, Order>;
  };
}

User.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: { type: new DataTypes.STRING(255), allowNull: true },
    lastName: { type: new DataTypes.STRING(255), allowNull: true },
    email: { type: new DataTypes.STRING(255), allowNull: true },
    username: { type: new DataTypes.STRING(32), allowNull: true },
    password: { type: new DataTypes.STRING(255), allowNull: true },
    phone: { type: new DataTypes.STRING(255), allowNull: true },
    role: {
      type: new DataTypes.ENUM("customer", "admin", "driver"),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    sequelize: connection,
    paranoid: true,
    timestamps: true,
  },
);

export { User };
export default User;
