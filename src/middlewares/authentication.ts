import express, { Request, Response, NextFunction } from "express";
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

type jwtPayload = {
  username: string;
  email: string;
  type: string;
};

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET and ENCRYPTION_SECRET must be provided");
}

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const generateToken = (user: jwtPayload): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRATION } as SignOptions);
};

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token", token);
  if (!token) {
    res.status(401).json({ message: "Token is required" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwtPayload;
    req.body.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  }
  return;
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token is required" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwtPayload;
    if (decoded.type !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    req.body.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};

export {
  hashPassword,
  comparePassword,
  generateToken,
  isAuthenticated,
  isAdmin,
};
