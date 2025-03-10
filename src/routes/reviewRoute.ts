import express, { Request, Response } from "express";
import { createReview } from "../controllers/reviewController";
import { isAuthenticated } from "../middlewares/authentication";
import { get } from "http";

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
};

router.post("/CreateReview", isAuthenticated, createReview);

export default router;
