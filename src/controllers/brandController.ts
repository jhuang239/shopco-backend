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

const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);
    if (!brand) {
      res.status(404).json({ error: "Brand not found" });
      return;
    }
    await brand.destroy();
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};


export { addBrand, getBrands, deleteBrand };
