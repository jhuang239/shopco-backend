import { Request, Response } from "express";
import UserImg, { UserImgAttributes } from "../models/user-img";

const createUserImg = async (req: Request, res: Response) => {
  try {
    const { user_id, file_name } = req.body as UserImgAttributes;
    const userImg = await UserImg.create({ user_id, file_name });
    res.status(201).json(userImg);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  }
};

const updateUserImg = async (req: Request, res: Response) => {
  try {
    const { id, user_id, file_name } = req.body as UserImgAttributes;
    const userImg = await UserImg.findByPk(id);
    if (!userImg) {
      res.status(404).json({ error: "User image not found" });
      return;
    }
    UserImg.update({ user_id, file_name }, { where: { id } });
    res.status(200).json(userImg);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  }
};

const getUserImgById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userImgs = await UserImg.findByPk(id);
    if (!userImgs) {
      res.status(404).json({ error: "User image not found" });
      return;
    }
    res.status(200).json(userImgs);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  }
};

export { createUserImg, updateUserImg, getUserImgById };
