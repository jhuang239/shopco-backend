import express, { Request, Response } from "express";
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById,
} from "../controllers/productController";
import { getUsers } from "../controllers/userController";
import { addBrand, deleteBrand } from "../controllers/brandController";
import { addCategory, deleteCategory } from "../controllers/categoryController";
import { createSale } from "../controllers/saleController";
import {
  uploadFilesToFirebase,
  deleteFileFromFirebase,
  deleteFileFromFirebaseByImgIds,
} from "../middlewares/firebase";
import { createProductImg } from "../controllers/product-imgController";
import { upload } from "../middlewares/multer";
import { createCode, deleteCode } from "../controllers/codeController";
const router = express.Router();

/**
 * @swagger
 * /admin/addProduct:
 *   post:
 *     summary: Create a new product
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
router.post(
  "/addProduct",
  upload.array("images", 5),
  addProduct,
  uploadFilesToFirebase,
  createProductImg
);

/**
 * @swagger
 * /admin/updateProduct/{id}:
 *   put:
 *     summary: Update a product by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.put(
  "/updateProduct/:id",
  upload.array("images", 5),
  updateProduct,
  deleteFileFromFirebaseByImgIds,
  uploadFilesToFirebase,
  createProductImg
);

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
 * /admin/deleteProduct/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *       '401':
 *         description: Unauthorized
 */
router.delete("/deleteProduct/:id", deleteFileFromFirebase, deleteProduct);

/**
 * @swagger
 * /admin/addBrand:
 *   post:
 *     summary: Create a new brand
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       '201':
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.post("/addBrand", addBrand);

/**
 * @swagger
 * /admin/deleteBrand/{id}:
 *   delete:
 *     summary: Delete a brand by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The brand ID
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/deleteBrand/:id", deleteBrand);

/**
 * @swagger
 * /admin/addCategory:
 *   post:
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '201':
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.post("/addCategory", addCategory);

/**
 * @swagger
 * /admin/deleteCategory/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 *       '404':
 *         description: Category not found
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.delete("/deleteCategory/:id", deleteCategory);

/**
 * @swagger
 * /admin/addCode:
 *   post:
 *     summary: Create a new code
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Code'
 *     responses:
 *       '201':
 *         description: Code created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Code'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.post("/addCode", createCode);

/**
 * @swagger
 * /admin/deleteCode/{id}:
 *   delete:
 *     summary: Delete a code by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the code to delete
 *     responses:
 *       '200':
 *         description: Code deleted successfully
 *       '404':
 *         description: Code not found
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.delete("/deleteCode/:id", deleteCode);

/**
 * @swagger
 * /admin/createSale:
 *   post:
 *     summary: Create a new sale
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       '201':
 *         description: Sale created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.post("/createSale", createSale);

export default router;
