require("dotenv").config();
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
app.use(express.json()); // <-- This is required to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // <-- This is for parsing URL-encoded bodies

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/auth", authRoute);
app.use("/cart", cartRoute);
app.use("/review", reviewRoute);
// app.use("/admin", isAdmin, adminRoute);
app.use("/admin", adminRoute);

sequelize.sync().then(() => {
  console.log("Database connected");
  relationshipInit(sequelize);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
