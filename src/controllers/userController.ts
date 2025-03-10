import { Request, Response } from "express";
import User, { UserAttributes } from "../models/user";
import { hashPassword } from "../middlewares/authentication";
import UserImg from "../models/user-img";

const updateUser = async (req: Request, res: Response) => {
  try {
    const username = req.params.id;
    const { email, password } = req.body as UserAttributes;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const hashedPassword = await hashPassword(password);

    const result = await User.update(
      { username, email, password: hashedPassword },
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

const uploadUserImage = async (req: Request, res: Response) => {
  try {
    const username = req.params.id;
    console.log(req.body.uploadedFile);
    console.log(username);
    const userImage = await UserImg.findOne({ where: { user_id: username } });
    console.log(userImage);
    if (userImage) {
      await UserImg.update(
        { file_name: req.body.uploadedFile },
        { where: { user_id: username } }
      );
      res.status(200).json({ message: "Image uploaded successfully" });
    } else {
      await UserImg.create({
        user_id: username,
        file_name: req.body.uploadedFile,
      });
      res.status(200).json({ message: "Image uploaded successfully" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export { updateUser, getUsers, getUserById, uploadUserImage };
