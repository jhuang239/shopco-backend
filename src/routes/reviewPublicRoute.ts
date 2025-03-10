import express, { Request, Response } from "express";
import {
    getReviewByProductId,
    getTop9Reviews
} from "../controllers/reviewController";
import { isAuthenticated } from "../middlewares/authentication";
import { get } from "http";

const router = express.Router();

export const reviewPublicSchema = {
    "/reviewPublic/top9": {
        get: {
            summary: "Retrieve top 10 reviews",
            tags: ["ReviewPublic"],
            responses: {
                "200": {
                    description: "A list of top 10 reviews",
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
        }
    },
    "/reviewPublic/{id}": {
        get: {
            summary: "Retrieve a review by ID",
            tags: ["ReviewPublic"],
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

//order of the routes matters
router.get("/top9", getTop9Reviews);

router.get("/:id", getReviewByProductId);



export default router;
