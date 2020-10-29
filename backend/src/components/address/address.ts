import { DataTypes, Model } from "sequelize";
// import User from "../user/user";
import connection from "../../utils/db";

class Address extends Model {
  public addressId?: string | number;
  public customerId?: string | number;
  public addressLine1?: string;
  public addressLine2?: string;
  public latitude?: string | number;
  public longitude?: string | number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt!: Date;
}

Address.init(
  {
    addressId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    addressLine1: { type: new DataTypes.TEXT("medium"), allowNull: true },
    addressLine2: { type: new DataTypes.TEXT("medium"), allowNull: true },
    latitude: { type: new DataTypes.FLOAT(10, 7), allowNull: true },
    longitude: { type: new DataTypes.FLOAT(10, 7), allowNull: true },
  },
  {
    tableName: "addresses",
    sequelize: connection,
    paranoid: true,
    timestamps: true,
  }
);

export { Address as CustomerAddress };
export default Address;
