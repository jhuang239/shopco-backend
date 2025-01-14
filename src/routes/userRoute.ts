import express, { Request, Response } from "express";
import { updateUser } from "../controllers/userController";

const router = express.Router();

/**
 * @swagger
 * /user/updateUser:
 *   post:
 *     summary: update the user details
 *     tags: [User]
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
router.post("/updateUser", updateUser);

export default router;
