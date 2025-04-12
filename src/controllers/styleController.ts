import { Request, Response } from "express";
import DressStyle, { DressStyleAttributes } from "../models/dress-style";

const addStyle = async (req: Request, res: Response) => {
    try {
        const { name } = req.body as DressStyleAttributes;
        const style = await DressStyle.create({
            name,
        });
        res.status(201).json(style);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

const getStyles = async (req: Request, res: Response) => {
    try {
        const styles = await DressStyle.findAll();
        res.status(200).json(styles);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

export { addStyle, getStyles };
