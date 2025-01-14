import Product from "../models/product";
import { Request, Response } from "express";

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
    console.log("req.params", req.params);
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(200).json(product);
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
