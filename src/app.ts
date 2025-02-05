require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import express, { Express } from "express";
import sequelize from "./utils/database";
import cors from "cors";
//* routes
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";
import authRoute from "./routes/authRoute";
import adminRoute from "./routes/adminRoute";
import reviewRoute from "./routes/reviewRoute";
//* swagger
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import config from "./swagger.config";

//* middleware
import { isAuthenticated, isAdmin } from "./middlewares/authentication";
import relationshipInit from "./utils/relationship-init";

const app: Express = express();
const PORT = process.env.PORT || 3000;

const swaggerSpec = swaggerJSDoc(config);

// Add these middleware before your routes
app.use(cors());

const resetCache = (req: any, res: any, next: NextFunction) => {
  // Clear all response headers
  res.removeHeader('Cache-Control');
  res.removeHeader('ETag');
  res.removeHeader('Last-Modified');

  // Set new cache headers
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  // Clear session
  if (req.session) {
    req.session.destroy();
  }

  // Clear params and query
  req.params = {};
  req.query = {};

  // Clear any local variables
  res.locals = {};

  next();
};

// Use it as middleware
app.use(resetCache);

app.use(express.json()); // <-- This is required to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // <-- This is for parsing URL-encoded bodies

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/user", isAuthenticated, userRoute);
app.use("/products", productRoute);
app.use("/auth", authRoute);
app.use("/cart", isAuthenticated, cartRoute);
app.use("/review", isAuthenticated, reviewRoute);
// app.use("/admin", isAdmin, adminRoute);
app.use("/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

sequelize.sync().then(() => {
  console.log("Database connected");
  relationshipInit(sequelize);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
