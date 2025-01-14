import { Request, Response } from "express";
import User, { UserAttributes } from "../models/user";

const updateUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as UserAttributes;
    const result = await User.update(
      { username, email, password },
      { where: { username } }
    );
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { username } = req.body as UserAttributes;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export { updateUser, getUsers, getUserById };
