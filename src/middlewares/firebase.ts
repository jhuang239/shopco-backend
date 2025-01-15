import { Request, Response, NextFunction } from "express";
import { storage } from "../utils/firebase-config";
import ProductImg from "../models/product-img";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
3;
type firebaseFile = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
};

const uploadFileToFirebase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) {
    throw new Error("no file uploaded");
  }
  try {
    const uploadedFiles: string[] = [];
    const files = (req.files as Express.Multer.File[]).map(async (file) => {
      try {
        const fileName = `${Date.now()}_${file.originalname}`;
        const storageRef = ref(storage, fileName);
        const metadata = {
          contentType: file.mimetype,
          cacheControl: "public, max-age=31536000",
          customMetadata: {
            uploadedBy: "admin",
            uploadedAt: new Date().toISOString(),
          },
        };
        const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
        uploadedFiles.push(fileName);
      } catch (error) {
        console.error(error);
      }
    });
    await Promise.all(files);
    req.body.uploadedFiles = uploadedFiles;
    next();
  } catch (error) {
    next(error);
  }
};

const deleteFileFromFirebase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product_id = req.params.id;
    const productImgs = await ProductImg.findAll({ where: { product_id } });
    const files = productImgs.map(async (productImg) => {
      try {
        const filename = productImg.dataValues.file_name;
        const storageRef = ref(storage, filename);
        await deleteObject(storageRef);
      } catch (error) {
        console.error(error);
      }
    });
    await Promise.all(files);
    next();
  } catch (error) {
    next(error);
  }
};

const getFileByFileName = async (filename: string) => {
  try {
    const storageRef = ref(storage, filename);
    const previewUrl = await getDownloadURL(storageRef);
    return previewUrl;
  } catch (error) {
    console.error(error);
    return "Picture not found";
  }
};

export { uploadFileToFirebase, deleteFileFromFirebase, getFileByFileName };
