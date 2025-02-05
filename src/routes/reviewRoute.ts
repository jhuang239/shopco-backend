import express, { Request, Response } from "express";
import {
  createReview,
  getReviewByProductId,
} from "../controllers/reviewController";
import { isAuthenticated } from "../middlewares/authentication";

const router = express.Router();

export const reviewSchema = {
  "/Review/CreateReview": {
    post: {
      summary: "Retrieve a list of cart items",
      tags: ["Review"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Review",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "A list of cart items",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Review",
                },
              },
            },
          },
        },
        "500": {
          description: "An error occurred",
        },
      },
    },
  },
  "/Review/{id}": {
    get: {
      summary: "Retrieve a review by ID",
      tags: ["Review"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "The review ID",
        },
      ],
      responses: {
        "200": {
          description: "A review object",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Review",
              },
            },
          },
        },
        "404": {
          description: "Review not found",
        },
        "500": {
          description: "An error occurred",
        },
      },
    },
  },
};

router.post("/CreateReview", isAuthenticated, createReview);

router.get("/:id", getReviewByProductId);

export default router;
