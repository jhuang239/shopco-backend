import express, { Request, Response } from "express";
import { updateUser, uploadUserImage } from "../controllers/userController";
import {
  uploadUserImageToFirebase,
  deleteUserImageFromFirebase,
} from "../middlewares/firebase";
import { upload } from "../middlewares/multer";

const router = express.Router();

/**
 * @swagger
 * /user/updateUser/{id}:
 *   post:
 *     summary: Update the user details
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Email already exists
 *       '500':
 *         description: Internal server error
 */
router.post("/updateUser/:id", updateUser);

/**
 * @swagger
 * /user/uploadImage/{id}:
 *   post:
 *     summary: Upload an image for the user
 *     tags: [User]
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserImg'
 *     responses:
 *       '200':
 *         description: Image uploaded successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post(
  "/uploadImage/:id",
  upload.single("file_name"),
  uploadUserImageToFirebase,
  uploadUserImage
);

/**
 * @swagger
 * /user/deleteUserImage/{id}:
 *  delete:
 *     summary: Upload an image for the user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *     responses:
 *       '200':
 *         description: Image uploaded successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.delete("/deleteUserImage/:id", deleteUserImageFromFirebase);

export default router;
