import express, { Request, Response } from "express";
import { getStyles } from "../controllers/styleController";

const router = express.Router();

export const styleSchema = {
    "/styles": {
        get: {
            tags: ["Style"],
            summary: "Retrieve a list of styles",
            responses: {
                "200": {
                    description: "A list of styles",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Style",
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

router.get("/", getStyles);

export default router;
