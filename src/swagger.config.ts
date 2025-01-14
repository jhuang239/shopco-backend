// swagger.config.ts
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      // schemas: {
      //   Error: {
      //     type: "object",
      //     properties: {
      //       message: {
      //         type: "string",
      //       },
      //     },
      //   },
      // },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
