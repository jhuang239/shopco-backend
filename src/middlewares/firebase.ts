import { Request, Response, NextFunction } from "express";
import { storage } from "../utils/firebase-config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

type firebaseFile = {
  originalname: string;
  buffer: Buffer;
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

    const snapshot = await uploadBytes(storageRef, file.buffer);

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

const getFileByFileName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileName = req.params.fileName;
    const storageRef = ref(storage, fileName);
    const downloadURL = await getDownloadURL(storageRef);
    req.body.image = { url: downloadURL, fileName: fileName };
    next();
  } catch (error) {
    next(error);
  }
};

export { uploadFileToFirebase, deleteFileFromFirebase, getFileByFileName };
