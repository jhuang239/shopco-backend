import Product from "../models/product";
import { NextFunction, Request, Response } from "express";
import ProductImg from "../models/product-img";
import Category from "../models/category";
import Brand from "../models/brand";
import { ProductAttributes } from "../models/product";
import {
  getFileByFileName,
  deleteFileFromFirebase,
} from "../middlewares/firebase";

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, stock, category_id, brand_id } =
      req.body as ProductAttributes;
    console.log(req.body);
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category_id,
      brand_id,
    });
    console.log("product", product);
    req.body.result_product_id = product.dataValues.id;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: ProductImg,
          attributes: ["file_name"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Brand,
          attributes: ["name"],
        },
      ],
      order: [
        ["id", "DESC"],
        [ProductImg, "id", "ASC"],
      ],
      group: ["Product.id", "Category.id", "Brand.id", "ProductImgs.id"],
    });
    console.log(products);
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const productImgs = await ProductImg.findAll({ where: { product_id: id } });
    const productImgUrls = [];
    for (let item of productImgs) {
      const url = await getFileByFileName(item.file_name);
      productImgUrls.push({
        id: item.id,
        file_name: item.file_name,
        url,
      });
    }
    res.status(200).json({ product, urls: productImgUrls });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category_id } = req.params;
    const products = await Product.findAll({
      where: {
        category_id,
      },
    });
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const getProductsByBrand = async (req: Request, res: Response) => {
  try {
    const { brand_id } = req.params;
    const products = await Product.findAll({
      where: {
        brand_id,
      },
    });
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const result = await Product.destroy({ where: { id } });
    const result_img = await ProductImg.destroy({ where: { product_id: id } });

    res.status(200).json({ result, result_img });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export {
  addProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsByBrand,
  deleteProduct,
};
