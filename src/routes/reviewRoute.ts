import express, { Request, Response } from "express";
import {
  createReview,
  getReviewByProductId,
} from "../controllers/reviewController";

const router = express.Router();

/**
 * @swagger
 * /Review:
 *   get:
 *     summary: Retrieve a list of cart items
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: A list of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: An error occurred
 */
router.get("/", (req, res) => {
  res.send("Hello from cart route");
});

/**
 * @swagger
 * /Review/CreateReview:
 *   post:
 *     summary: Create a new review
 *     security:
 *       - bearerAuth: []
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       '200':
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.post("/CreateReview", createReview);

/**
 * @swagger
 * /Review/{id}:
 *   get:
 *     summary: Retrieve a single review
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A single review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       '404':
 *         description: Review not found
 *       '500':
 *         description: An error occurred
 */
router.get("/:id", getReviewByProductId);

export default router;
