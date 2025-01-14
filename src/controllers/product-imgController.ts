import { Request, Response } from "express";
import ProductImg, { ProductImgAttributes } from "../models/product-img";

// * Todo: implement the function to store image in firebase

const createProductImg = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { product_id, file_name } = req.body as ProductImgAttributes;
    const productImg = await ProductImg.create({ product_id, file_name });
    res.status(201).json(productImg);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const getImageByProductId = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
    const productImgs = await ProductImg.findAll({ where: { product_id } });
    res.status(200).json(productImgs);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export { createProductImg, getImageByProductId };
