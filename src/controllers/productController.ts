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
import { literal, Op } from "sequelize";
import Sale from "../models/sale";
import Review from "../models/review";
import User from "../models/user";

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, stock, category_id, brand_id, style_id } =
      req.body as ProductAttributes;
    console.log(req.body);
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category_id,
      brand_id,
      style_id,
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

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, description, price, stock, category_id, brand_id } =
    req.body as ProductAttributes;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const result = await Product.update(
      { name, description, price, stock, category_id, brand_id },
      { where: { id } }
    );
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
    let products = await Product.findAll({
      include: [
        {
          model: ProductImg,
          separate: true,
          limit: 1,
          attributes: ["id", "file_name"],
          order: [["createdAt", "ASC"]],
        },
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Brand,
          attributes: ["name"],
        },
        {
          model: Sale,
          separate: true,
          limit: 1,
          attributes: ["discount"],
          where: {
            start_date: {
              [Op.lte]: literal("CURRENT_DATE"),
            },
            end_date: {
              [Op.gte]: literal("CURRENT_DATE"),
            },
          },
        },
      ],
      attributes: {
        include: [
          [
            literal(`(SELECT ROUND(COALESCE(AVG(rating), 0), 2) FROM reviews WHERE reviews.product_id = "Product".id)`),
            'averageRating'
          ]
        ]
      }
    });

    await Promise.all(
      products.map(async (product: any) => {
        const file_name =
          product.dataValues.ProductImgs[0].dataValues.file_name;
        const url = await getFileByFileName(file_name);
        product.dataValues.ProductImgs[0].dataValues.url = url;
        return product; // Return the modified product
      })
    );

    res.status(200).json(products); // Send the original products array which was modified
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
    const product: any = await Product.findByPk(id, {
      include: [
        {
          model: Review,
          attributes: ["comment", "rating", "createdAt"],
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
        {
          model: ProductImg,
          attributes: ["id", "file_name"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Brand,
          attributes: ["name"],
        },
        {
          model: Sale,
          separate: true,
          limit: 1,
          attributes: ["discount"],
          where: {
            start_date: {
              [Op.lte]: literal("CURRENT_DATE"),
            },
            end_date: {
              [Op.gte]: literal("CURRENT_DATE"),
            },
          },
        },
      ],
      order: [[Review, "createdAt", "DESC"]],
    });

    await Promise.all(
      product.dataValues.ProductImgs.map(async (img: any) => {
        const url = await getFileByFileName(img.dataValues.file_name);
        img.dataValues.url = url;
        return img;
      })
    )

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
    const { id } = req.params;
    let products = await Product.findAll({
      include: [
        {
          model: ProductImg,
          separate: true,
          limit: 1,
          attributes: ["id", "file_name"],
          order: [["createdAt", "ASC"]],
        },
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Brand,
          attributes: ["name"],
        },
        {
          model: Sale,
          separate: true,
          limit: 1,
          attributes: ["discount"],
          where: {
            start_date: {
              [Op.lte]: literal("CURRENT_DATE"),
            },
            end_date: {
              [Op.gte]: literal("CURRENT_DATE"),
            },
          },
        },
      ],
      attributes: {
        include: [
          [
            literal(`(SELECT ROUND(COALESCE(AVG(rating), 0), 2) FROM reviews WHERE reviews.product_id = "Product".id)`),
            'averageRating'
          ]
        ]
      },
      where: {
        brand_id: id,
      },
    });

    await Promise.all(
      products.map(async (product: any) => {
        const file_name =
          product.dataValues.ProductImgs[0].dataValues.file_name;
        const url = await getFileByFileName(file_name);
        product.dataValues.ProductImgs[0].dataValues.url = url;
        return product; // Return the modified product
      })
    );

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
    const { id } = req.params;
    let products = await Product.findAll({
      include: [
        {
          model: ProductImg,
          separate: true,
          limit: 1,
          attributes: ["id", "file_name"],
          order: [["createdAt", "ASC"]],
        },
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Brand,
          attributes: ["name"],
        },
        {
          model: Sale,
          separate: true,
          limit: 1,
          attributes: ["discount"],
          where: {
            start_date: {
              [Op.lte]: literal("CURRENT_DATE"),
            },
            end_date: {
              [Op.gte]: literal("CURRENT_DATE"),
            },
          },
        },
      ],
      attributes: {
        include: [
          [
            literal(`(SELECT ROUND(COALESCE(AVG(rating), 0), 2) FROM reviews WHERE reviews.product_id = "Product".id)`),
            'averageRating'
          ]
        ]
      },
      where: {
        brand_id: id,
      },
    });

    await Promise.all(
      products.map(async (product: any) => {
        const file_name =
          product.dataValues.ProductImgs[0].dataValues.file_name;
        const url = await getFileByFileName(file_name);
        product.dataValues.ProductImgs[0].dataValues.url = url;
        return product; // Return the modified product
      })
    );

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
  updateProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsByBrand,
  deleteProduct,
};
