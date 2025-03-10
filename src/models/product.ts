import { Optional } from "sequelize";
import { HasMany, BelongsTo } from "sequelize-typescript";
import { BelongsToMany } from "sequelize-typescript";
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
import Sale from "./sale";

type ProductAttributes = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_ids: string[];
  brand_id: string;
  style_ids: string[];
  categories?: Category[];
  styles?: DressStyle[];
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
    async categoryExists(value: string[]) {
      // Check each category ID individually
      for (const categoryId of value) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          throw new Error(`Category with ID ${categoryId} does not exist`);
        }
      }
    },
  })
  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
  })
  declare category_ids: string[];

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
    async styleExists(value: string[]) {
      // Check each style ID individually
      for (const styleId of value) {
        const style = await DressStyle.findByPk(styleId);
        if (!style) {
          throw new Error(`Style with ID ${styleId} does not exist`);
        }
      }
    },
  })
  @ForeignKey(() => DressStyle)
  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
  })
  declare style_ids: string[];


  @HasMany(() => ProductImg, {
    foreignKey: 'product_id',
  })
  ProductImgs?: ProductImg[];

  @BelongsTo(() => Brand, {
    foreignKey: 'brand_id',
  })
  Brand?: Brand;

  @HasMany(() => Sale, {
    foreignKey: 'product_id',
  })
  Sales?: Sale[];
}

export { ProductAttributes };
