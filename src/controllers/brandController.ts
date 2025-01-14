import { Request, Response } from "express";
import Brand, { BrandAttributes } from "../models/brand";

const addBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as BrandAttributes;
    const brand = await Brand.create({
      name,
    });
    res.status(201).json(brand);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.findAll();
    res.status(200).json(brands);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
