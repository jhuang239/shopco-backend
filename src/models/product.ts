import { Optional } from "sequelize";
import { Table, Column, Model, DataType } from "sequelize-typescript";

type ProductAttributes = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  brand_id: number;
};

type ProductCreationAttributes = Optional<ProductAttributes, "id">;

@Table({
  tableName: "products",
  timestamps: true,
  modelName: "Product",
})
export default class Product extends Model<
  ProductAttributes,
  ProductCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare stock: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare category_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare brand_id: number;
}
