import { Optional } from "sequelize";
import Product from "./product";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Validate,
} from "sequelize-typescript";

type SaleAttributes = {
  id: string;
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
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

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
  @Validate({
    async productExists(value: string) {
      const product = await Product.findByPk(value);
      if (!product) {
        throw new Error("Product does not exist");
      }
    },
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare product_id: string;
}

export { SaleAttributes };
