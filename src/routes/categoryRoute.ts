import express, { Request, Response } from "express";
import { getCategories } from "../controllers/categoryController";

const router = express.Router();

export const categorySchema = {
    "/categories": {
        get: {
            tags: ["Category"],
            summary: "Retrieve a list of categories",
            responses: {
                "200": {
                    description: "A list of categories",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Category"
                                }
                            }
                        }
                    }
                },
                "500": {
                    description: "An error occurred"
                }
            }
        }
    }
}

router.get("/", getCategories);

export default router;