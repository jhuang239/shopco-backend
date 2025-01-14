import { Request, Response, NextFunction } from "express";
import { storage } from "../utils/firebase-config";
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
  try {
    if (!req.file) {
      throw new Error("no file uploaded");
    }
    const file = req.file as firebaseFile;
    const fileName = `${Date.now()}_${file.originalname}`;
    const storageRef = ref(storage, fileName);

    const metadata = {
      contentType: file.mimetype,
      cachesControl: "public, max-age=31536000",
    };

    const snapshot = await uploadBytes(storageRef, file.buffer, metadata);

    req.body.file_name = fileName;
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
    const fileName = req.params.fileName;
    const storageRef = ref(storage, fileName);
    const result = await deleteObject(storageRef);
    req.body.result = result;
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
