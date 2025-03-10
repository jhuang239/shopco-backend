import { Request, Response } from "express";
import Sale, { SaleAttributes } from "../models/sale";

const createSale = async (req: Request, res: Response) => {
  const { start_date, end_date, discount, product_id } = req.body;
  try {
    const sale = await Sale.create({
      start_date,
      end_date,
      discount,
      product_id,
    });
    res.status(201).json(sale);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const getSaleByProductId = async (req: Request, res: Response) => {
  const { product_id } = req.params;
  try {
    const sales = await Sale.findAll({ where: { product_id } });
    if (sales.length === 0) {
      res.status(404).json({ error: "Sale not found" });
      return;
    }
    res.status(200).json(sales);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export { createSale, getSaleByProductId };
