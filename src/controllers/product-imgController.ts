import { Request, Response } from "express";
import ProductImg, { ProductImgAttributes } from "../models/product-img";
import { deleteFileFromFirebase } from "../middlewares/firebase";

// * Todo: implement the function to store image in firebase

const createProductImg = async (req: Request, res: Response) => {
  try {
    const product_id = req.body.result_product_id;
    const file_names = req.body.uploadedFiles;
    console.log("product_id", product_id);
    const createdRecords: string[] = [];
    for (const file_name of file_names) {
      const productImg = await ProductImg.create({ product_id, file_name });
      createdRecords.push(productImg.dataValues.id);
    }
    res.status(201).json(createdRecords);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export { createProductImg };
