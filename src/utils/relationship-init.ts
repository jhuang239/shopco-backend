import Product from "../models/product";
import Brand from "../models/brand";
import Category from "../models/category";
import ProductImg from "../models/product-img";
import User from "../models/user";
import Cart from "../models/cart";
import Review from "../models/review";
import Sale from "../models/sale";
import UserImg from "../models/user-img";

import { QueryInterface, Sequelize } from "sequelize";
import DressStyle from "../models/dress-style";

const relationshipInit = async (sequelize: Sequelize) => {
  const queryInterface: QueryInterface = sequelize.getQueryInterface();
  await queryInterface.sequelize.query(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'
  );

  Category.hasMany(Product, { foreignKey: "category_id" });
  Product.belongsTo(Category, { foreignKey: "category_id" });

  Brand.hasMany(Product, { foreignKey: "brand_id" });
  Product.belongsTo(Brand, { foreignKey: "brand_id" });

  Product.hasMany(ProductImg, { foreignKey: "product_id" });
  ProductImg.belongsTo(Product, { foreignKey: "product_id" });

  Product.hasMany(Sale, { foreignKey: "product_id" });
  Sale.belongsTo(Product, { foreignKey: "product_id" });

  Product.hasMany(Review, { foreignKey: "product_id" });
  Review.belongsTo(Product, { foreignKey: "product_id" });

  DressStyle.hasMany(Product, { foreignKey: "style_id" });
  Product.belongsTo(DressStyle, { foreignKey: "style_id" });

  User.hasMany(Review, { foreignKey: "user_id" });
  Review.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Cart, { foreignKey: "user_id" });
  Cart.belongsTo(User, { foreignKey: "user_id" });
  Cart.belongsTo(Product, { foreignKey: "product_id" });

  User.hasOne(UserImg, { foreignKey: "user_id" });
  UserImg.belongsTo(User, { foreignKey: "user_id" });

  await sequelize.sync();
};

export default relationshipInit;
