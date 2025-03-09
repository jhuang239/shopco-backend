import express, { Request, Response } from "express";
import {
  getCartQuantity,
  getCart,
  addProductToCart,
  increaseProductQuantity,
  reduceProductQuantity,
  // updateProductQuantity,
  removeProductFromCart,
  clearCart,
} from "../controllers/cartController";

export const cartSchema = {
  "/cart/quantity": {
    get: {
      summary: "Retrieve the quantity of items in the cart",
      tags: ["Cart"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        "200": {
          description: "The set of item ids in the cart",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                  },
                }
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
  "/cart": {
    get: {
      summary: "Retrieve a list of cart items",
      tags: ["Cart"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        "200": {
          description: "A list of cart items",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    user_id: { type: "number" },
                    product_id: { type: "number" },
                    quantity: { type: "number" },
                    createdAt: { type: "string" },
                    updatedAt: { type: "string" },
                  },
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
  "/cart/addProductToCart": {
    post: {
      summary: "Add a product to the cart",
      tags: ["Cart"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                product_id: { type: "string" },
                quantity: { type: "number" },
                size: { type: "string" },
                color: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Product added to cart",
        },
        "500": {
          description: "An error occurred",
        },
      },
    },
  },
  "/cart/increaseProductQuantity": {
    put: {
      summary: "Increase the quantity of a product in the cart",
      tags: ["Cart"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Product quantity increased",
        },
        "500": {
          description: "An error occurred",
        },
      },
    },
  },
  "/cart/reduceProductQuantity": {
    put: {
      summary: "Reduce the quantity of a product in the cart",
      tags: ["Cart"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Product quantity reduced",
        },
        "500": {
          description: "An error occurred",
        },
      },
    },
  },
  // "/cart/updateProductQuantity": {
  //   put: {
  //     summary: "Update the quantity of a product in the cart",
  //     tags: ["Cart"],
  //     security: [
  //       {
  //         bearerAuth: [],
  //       },
  //     ],
  //     requestBody: {
  //       content: {
  //         "application/json": {
  //           schema: {
  //             type: "object",
  //             properties: {
  //               product_id: { type: "string" },
  //               quantity: { type: "number" },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     responses: {
  //       "200": {
  //         description: "Product quantity updated",
  //       },
  //       "500": {
  //         description: "An error occurred",
  //       },
  //     },
  //   },
  // },
  "/cart/removeProductFromCart": {
    delete: {
      summary: "Remove a product from the cart",
      tags: ["Cart"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Product removed from cart",
        },
        "500": {
          description: "An error occurred",
        },
      },
    },
  },
  "/cart/clearCart": {
    delete: {
      summary: "Clear the cart",
      tags: ["Cart"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        "200": {
          description: "Cart cleared",
        },
        "500": {
          description: "An error occurred",
        },
      },
    },
  },
};

const router = express.Router();

router.get("/quantity", getCartQuantity);

router.get("/", getCart);

router.post("/addProductToCart", addProductToCart);

router.put("/increaseProductQuantity", increaseProductQuantity);

router.put("/reduceProductQuantity", reduceProductQuantity);

// router.put("/updateProductQuantity", updateProductQuantity);

router.delete("/removeProductFromCart", removeProductFromCart);

router.delete("/clearCart", clearCart);

export default router;
