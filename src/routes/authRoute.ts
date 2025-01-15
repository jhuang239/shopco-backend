import express, { Request, Response } from "express";
import { registerUser, loginUser } from "../controllers/authController";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  - name: Auth
 *    description: The authentication managing API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Email already exists
 *       '500':
 *         description: Internal server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '400':
 *         description: User not found
 */
router.post("/login", loginUser);

export default router;
