import express, { Request, Response } from "express";
import { addProduct } from "../controllers/productController";
import { getUsers } from "../controllers/userController";
import { uploadFileToFirebase } from "../middlewares/firebase";
import { createProductImg } from "../controllers/product-imgController";
import { upload } from "../middlewares/multer";
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - category_id
 *         - brand_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The product name
 *         description:
 *           type: string
 *           description: The product description
 *         price:
 *           type: number
 *           description: The product price
 *         stock:
 *           type: number
 *           description: The product number in stock
 *         category_id:
 *           type: string
 *           description: The category id of the product
 *         brand_id:
 *           type: string
 *           description: The brand id of the product
 */

/**
 * @swagger
 * /admin/addProduct:
 *   post:
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 */
router.post("/addProduct", addProduct);

/**
 * @swagger
 * /admin/allUsers:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: All users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 */
router.get("/allUsers", getUsers);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product-Image:
 *       type: object
 *       required:
 *         - product_id
 *         - file
 *       properties:
 *         product_id:
 *           type: string
 *           description: The id of the product
 *         file:
 *           type: string
 *           format: binary
 *           description: The image file of the product
 *
 *     Product-Image-Response:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The response message
 *         imageUrl:
 *           type: string
 *           description: The image url of the product
 */

/**
 * @swagger
 * /admin/addProductImage:
 *   post:
 *     summary: Add an image to a product
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Product-Image'
 *     responses:
 *       200:
 *         description: Image added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product-Image-Response'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 */
router.post(
  "/addProductImage",
  upload.single("image"),
  uploadFileToFirebase,
  createProductImg
);

export default router;
