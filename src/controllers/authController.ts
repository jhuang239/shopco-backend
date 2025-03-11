import { Request, Response } from "express";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../middlewares/authentication";

import User, { UserAttributes } from "../models/user";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as UserAttributes;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      type: "user",
    });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as UserAttributes;
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid password" });
      return;
    }
    console.log("username", user.username);
    console.log("email", user.email);
    const token = generateToken({
      username: user.username,
      email: user.email,
      type: user.type,
    });
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export { registerUser, loginUser };
