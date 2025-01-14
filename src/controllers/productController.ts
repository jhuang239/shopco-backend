import Product from "../models/product";
import { Request, Response } from "express";
import ProductImg from "../models/product-img";
import { getFileByFileName } from "../middlewares/firebase";

type IProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  brand_id: number;
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, category_id, brand_id } =
      req.body as IProduct;
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category_id,
      brand_id,
    });
    res.status(201).json(product);
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
    const products = await Product.findAll();
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

export {
  addProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsByBrand,
};
