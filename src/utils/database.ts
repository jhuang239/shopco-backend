require("dotenv").config();
import { Sequelize } from "sequelize-typescript";
import shopCoModels from "../models/models";

const sequelize = new Sequelize({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  dialect: "postgres",
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  models: shopCoModels,
});

export default sequelize;
