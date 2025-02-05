import express from "express";
import { getProducts, getProductById, getProductsByBrand, getProductsByCategory } from "../controllers/productController";
const router = express.Router();

export const productSchema = {
  "/products/all": {
    get: {
      summary: "Retrieve a list of products",
      tags: ["Products"],
      responses: {
        "200": {
          description: "A list of products",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Product",
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
  "/products/category/ids": {
    post: {
      summary: "Retrieve a list of products",
      tags: ["Products"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                category_ids: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "A list of products",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Product",
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
  "/products/brand/{id}": {
    get: {
      summary: "Retrieve a list of products",
      tags: ["Products"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "The Brand ID",
        },
      ],
      responses: {
        "200": {
          description: "A list of products",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Product",
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
  "/products/{id}": {
    get: {
      summary: "Get a single product by ID",
      tags: ["Products"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "The product ID",
        },
      ],
      responses: {
        "200": {
          description: "Product details",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        "404": {
          description: "Product not found",
        },
        "500": {
          description: "Server error",
        },
      },
    },
  },
};
router.get("/all", getProducts);

router.get("/:id", getProductById);

router.post("/category/ids", getProductsByCategory);

router.get("/brand/:id", getProductsByBrand);

router.get("/dummy/haha", (req, res) => {
  res.send("Hello World!");
});

export default router;
