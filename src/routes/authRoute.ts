import express, { Request, Response } from "express";
import { registerUser, loginUser } from "../controllers/authController";
const router = express.Router();

export const authSchema = {
  "/auth/register": {
    post: {
      summary: "Register a new user",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "User created successfully",
        },
        "400": {
          description: "Email already exists",
        },
        "500": {
          description: "Internal server error",
        },
      },
    },
  },
  "/auth/login": {
    post: {
      summary: "Login a user",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/loginUser",
            },
          },
        },
        example: {},
      },
      responses: {
        "200": {
          description: "User logged in successfully",
        },
        "400": {
          description: "User not found",
        },
      },
    },
  },
};

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
