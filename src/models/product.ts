import { Optional } from "sequelize";
import ProductImg from "./product-img";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Validate,
} from "sequelize-typescript";
import Category from "./category";
import Brand from "./brand";
import DressStyle from "./dress-style";

type ProductAttributes = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  brand_id: string;
  style_id: string;
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
    type: DataType.TEXT,
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

  @ForeignKey(() => Category)
  @Validate({
    async categoryExists(value: string) {
      const category = await Category.findByPk(value);
      if (!category) {
        throw new Error("Category does not exist");
      }
    },
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare category_id: string;

  @Validate({
    async brandExists(value: string) {
      const brand = await Brand.findByPk(value);
      if (!brand) {
        throw new Error("Brand does not exist");
      }
    },
  })
  @ForeignKey(() => Brand)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare brand_id: string;

  @Validate({
    async styleExists(value: string) {
      const style = await DressStyle.findByPk(value);
      if (!style) {
        throw new Error("Style does not exist");
      }
    },
  })
  @ForeignKey(() => DressStyle)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare style_id: string;

}

export { ProductAttributes };
