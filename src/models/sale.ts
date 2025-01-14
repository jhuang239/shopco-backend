import { Optional } from "sequelize";
import Product from "./product";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";

type SaleAttributes = {
  id: number;
  start_date: Date;
  end_date: Date;
  discount: number;
  product_id: string;
};

type SaleCreationAttributes = Optional<SaleAttributes, "id">;

@Table({
  tableName: "sales",
  timestamps: true,
  modelName: "Sale",
})
export default class Sale extends Model<
  SaleAttributes,
  SaleCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    defaultValue: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare end_date: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare discount: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare product_id: string;
}

export { SaleAttributes };
