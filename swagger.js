const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "My API Description",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to the API docs sub-folder
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
