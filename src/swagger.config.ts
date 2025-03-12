// swagger.config.ts
import { updateUserSchema } from "./routes/userRoute";
import { productSchema } from "./routes/productRoute";
import { adminSchema } from "./routes/adminRoute";
import { authSchema } from "./routes/authRoute";
import { reviewSchema } from "./routes/reviewRoute";
import { cartSchema } from "./routes/cartRoute";
import { reviewPublicSchema } from "./routes/reviewPublicRoute";
import { categorySchema } from "./routes/categoryRoute";
import { brandSchema } from "./routes/brandRoute";

const routeSchemas = {
  ...updateUserSchema,
  ...productSchema,
  ...adminSchema,
  ...authSchema,
  ...reviewSchema,
  ...reviewPublicSchema,
  ...cartSchema,
  ...categorySchema,
  ...brandSchema,
  "/": {
    get: {
      tags: ["Home"],
      summary: "Get the home page",
      responses: {
        "200": {
          description: "Home page",
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
    },
    tags: [
      {
        name: "Auth",
        description: "The authentication managing API",
      },
      {
        name: "Admin",
        description: "The admin managing API",
      },
      {
        name: "Products",
        description: "The products managing API",
      },
      {
        name: "User",
        description: "The user managing API",
      },
      {
        name: "Review",
        description: "The review managing API",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
        User: {
          type: "object",
          required: ["email", "username", "password"],
          properties: {
            id: {
              type: "string",
            },
            email: {
              type: "string",
            },
            username: {
              type: "string",
            },
            password: {
              type: "string",
            },
            type: {
              type: "string",
            },
          },
          example: {
            username: "kimwong1118",
            email: "kimwong@example.com",
            password: "password",
          },
        },
        loginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
            },
            password: {
              type: "string",
            },
          },
          example: {
            username: "username",
            password: "password",
          },
        },
        UpdateProduct: {
          type: "object",
          required: [
            "name",
            "description",
            "price",
            "stock",
            "category_id",
            "brand_id",
          ],
          properties: {
            name: {
              type: "string",
              description: "The name of the product",
              example: "Adidas Superstar",
            },
            description: {
              type: "string",
              format: "textarea",
              description: "The description of the product",
              example: "A popular Adidas shoes",
            },
            price: {
              type: "number",
              description: "The price of the product",
              example: 100,
            },
            stock: {
              type: "number",
              description: "The stock of the product",
              example: 50,
            },
            category_id: {
              type: "string",
              description: "The id of the category",
              example: "90de8b53-aadd-4983-9740-9a821898b9e8",
            },
            brand_id: {
              type: "string",
              description: "The id of the brand",
              example: "ac00ab72-cafe-4c11-a9e8-4b893103a3e1",
            },
            images: {
              type: "array",
              items: {
                type: "string",
                format: "binary",
              },
              description: "The images of the product",
            },
            removedImages: {
              type: "string",
              format: "json",
              description: "The removed images of the product",
              example: '[{"id": 1, "file_name": "image1.jpg"}]',
            },
          },
          encoding: {
            removedImages: {
              contentType: "application/json",
            },
          },
        },
        Product: {
          type: "object",
          required: [
            "name",
            "description",
            "price",
            "stock",
            "category_ids",
            "brand_id",
            "images",
            "style_ids",
          ],
          properties: {
            name: {
              type: "string",
              description: "The name of the product",
              example: "Adidas Superstar",
            },
            description: {
              type: "string",
              format: "textarea",
              description: "The description of the product",
              example: "A popular Adidas shoes",
            },
            price: {
              type: "number",
              description: "The price of the product",
              example: 100,
            },
            stock: {
              type: "number",
              description: "The stock of the product",
              example: 50,
            },
            category_ids: {
              type: "array",
              items: {
                type: "string",
              },
              description: "The id of the categories",
              example: ["90de8b53-aadd-4983-9740-9a821898b9e8"],
            },
            brand_id: {
              type: "string",
              description: "The id of the brand",
              example: "ac00ab72-cafe-4c11-a9e8-4b893103a3e1",
            },
            images: {
              type: "array",
              items: {
                type: "string",
                format: "binary",
              },
              description: "The images of the product",
            },
            style_ids: {
              type: "array",
              items: {
                type: "string",
              },
              description: "The id of the styles",
              example: ["90de8b53-aadd-4983-9740-9a821898b9e8"],
            },
          },
        },
        Style: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
          },
          example: {
            name: "Casual",
          },
        },
        Brand: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
          },
          example: {
            name: "Adidas",
          },
        },
        Cart: {
          type: "object",
          required: ["product_id", "quantity", "user_id"],
          properties: {
            product_id: {
              type: "string",
            },
            quantity: {
              type: "number",
            },
            user_id: {
              type: "string",
            },
          },
          example: {
            user_id: "1",
            product_id: "1",
            quantity: 2,
          },
        },
        Category: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
          },
          example: {
            name: "Shoes",
          },
        },
        Code: {
          type: "object",
          required: ["code", "type", "discount", "start_date", "end_date"],
          properties: {
            id: {
              type: "string",
            },
            code: {
              type: "string",
            },
            type: {
              type: "string",
            },
            discount: {
              type: "number",
            },
            start_date: {
              type: "string",
              format: "date",
            },
            end_date: {
              type: "string",
              format: "date",
            },
          },
          example: {
            code: "CODE123",
            type: "percentage",
            discount: 10,
            start_date: "2022-01-01",
            end_date: "2022-12-31",
          },
        },
        Review: {
          type: "object",
          required: ["comment", "rating", "product_id"],
          properties: {
            comment: {
              type: "string",
              example: "Good product",
            },
            rating: {
              type: "number",
              example: 5, // 1-5
            },
            product_id: {
              type: "string",
              example: "0520a72e-dbc3-49b1-a56c-b9ad85996034",
            },
          },
        },
        Sale: {
          type: "object",
          required: ["start_date", "end_date", "discount", "product_id"],
          properties: {
            id: {
              type: "number",
            },
            start_date: {
              type: "string",
              format: "date",
            },
            end_date: {
              type: "string",
              format: "date",
            },
            discount: {
              type: "number",
            },
            product_id: {
              type: "string",
            },
          },
          example: {
            start_date: "2022-01-01",
            end_date: "2022-12-31",
            discount: 10,
            product_id: "1",
          },
        },
        UserImg: {
          type: "object",
          required: ["file_name"],
          properties: {
            file_name: {
              type: "string",
              format: "binary",
              description: "The image file of the user",
            },
          },
        },
      },
    },
    paths: routeSchemas,
  },
  apis: [],
};

export default swaggerOptions;
