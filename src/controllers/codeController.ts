import { Request, Response } from "express";
import Code, { CodeAttributes } from "../models/code";

const createCode = async (req: Request, res: Response) => {
  const { code, type, discount, start_date, end_date } = req.body;
  try {
    const newCode = await Code.create({
      code,
      type,
      discount,
      start_date,
      end_date,
    });
    res.status(201).json(newCode);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const deleteCode = async (req: Request, res: Response) => {
  const { code } = req.params;
  try {
    const codeExists = await Code.findOne({ where: { code } });
    if (codeExists) {
      await codeExists.destroy();
      res.status(200).json({ message: "Code deleted successfully" });
    } else {
      res.status(404).json({ error: "Code not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const getCode = async (req: Request, res: Response) => {
  const { code } = req.params;
  try {
    const codeExists = await Code.findOne({ where: { code } });
    if (codeExists) {
      res.status(200).json(codeExists);
    } else {
      res.status(404).json({ error: "Code not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export { createCode, getCode, deleteCode };
