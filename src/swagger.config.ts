// swagger.config.ts
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
        Product: {
          type: "object",
          required: [
            "name",
            "description",
            "price",
            "stock",
            "category_id",
            "brand_id",
            "images",
          ],
          properties: {
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            price: {
              type: "number",
            },
            stock: {
              type: "number",
            },
            category_id: {
              type: "string",
            },
            brand_id: {
              type: "string",
            },
            images: {
              type: "array",
              items: {
                type: "string",
                format: "binary",
              },
            },
          },
          example: {
            name: "Adidas Superstar",
            description: "A popular Adidas shoe",
            price: 100,
            stock: 50,
            category_id: "1",
            brand_id: "1",
            images: ["image1.jpg", "image2.jpg"],
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
          required: ["comment", "rating", "user_id", "product_id"],
          properties: {
            id: {
              type: "number",
            },
            comment: {
              type: "string",
            },
            rating: {
              type: "number",
            },
            user_id: {
              type: "string",
            },
            product_id: {
              type: "string",
            },
            comment_date: {
              type: "string",
              format: "date",
            },
          },
          example: {
            comment: "Good product",
            rating: 5,
            user_id: "1",
            product_id: "1",
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
          required: ["user_id", "file_name"],
          properties: {
            user_id: {
              type: "string",
              description: "The id of the user",
            },
            file_name: {
              type: "string",
              format: "binary",
              description: "The image file of the user",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
