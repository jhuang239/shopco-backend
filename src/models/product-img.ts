import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Validate,
} from "sequelize-typescript";
import Product from "./product";

type ProductImgAttributes = {
  id: string;
  product_id: string;
  file_name: string;
};

type ProductImgCreationAttributes = Optional<ProductImgAttributes, "id">;

@Table({
  tableName: "product_imgs",
  timestamps: true,
  modelName: "ProductImg",
})
export default class ProductImg extends Model<
  ProductImgAttributes,
  ProductImgCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare file_name: string;
}

export { ProductImgAttributes };
