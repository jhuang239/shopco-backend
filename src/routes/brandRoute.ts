import express, { Request, Response } from "express";
import { getBrands } from "../controllers/brandController";

export const brandSchema = {
    "/brands": {
        get: {
            tags: ["Brand"],
            summary: "Retrieve a list of brands",
            responses: {
                "200": {
                    description: "A list of brands",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Brand"
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
};

const router = express.Router();

router.get("/", getBrands);

export default router;