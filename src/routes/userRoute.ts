import express, { Request, Response } from "express";
import { updateUser, uploadUserImage } from "../controllers/userController";
import {
  uploadUserImageToFirebase,
  deleteUserImageFromFirebase,
} from "../middlewares/firebase";
import { upload } from "../middlewares/multer";

const router = express.Router();

export const updateUserSchema = {
  "/user/updateUser/{id}": {
    post: {
      tags: ["User"],
      summary: "Update the user details",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID of the user to update",
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "User updated successfully",
        },
        "400": {
          description: "Email already exists",
        },
        "500": {
          description: "Internal server error",
        },
      },
    },
  },
  "/user/deleteUserImage/{id}": {
    delete: {
      tags: ["User"],
      summary: "Delete user image from Firebase",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID of the user",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "Image deleted successfully",
        },
        "404": {
          description: "Image not found",
        },
        "500": {
          description: "Internal server error",
        },
      },
    },
  },
  "/user/uploadImage/{id}": {
    post: {
      summary: "Upload an image for the user",
      tags: ["User"],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/UserImg",
            },
          },
        },
      },
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID of the user to update",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "Image uploaded successfully",
        },
        "401": {
          description: "Unauthorized",
        },
        "500": {
          description: "Internal server error",
        },
      },
    },
  },
};

router.post("/updateUser/:id", updateUser);

router.post(
  "/uploadImage/:id",
  upload.single("file_name"),
  uploadUserImageToFirebase,
  uploadUserImage
);

router.delete("/deleteUserImage/:id", deleteUserImageFromFirebase);

export default router;
