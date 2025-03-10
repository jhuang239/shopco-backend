import { Request, Response, NextFunction } from "express";
import { storage } from "../utils/firebase-config";
import ProductImg from "../models/product-img";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import UserImg from "../models/user-img";
3;
type firebaseFile = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
};

const uploadUserImageToFirebase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    throw new Error("no file uploaded");
  }
  try {
    console.log("req.params.id", req.params.id);
    const oldFile = await UserImg.findOne({
      where: { user_id: req.params.id },
    });
    console.log("oldFile", oldFile);

    if (oldFile) {
      const storageRef = ref(storage, oldFile.dataValues.file_name);
      await deleteObject(storageRef);
    }

    const file = req.file as firebaseFile;
    const fileName = `${Date.now()}_${file.originalname}`;
    const storageRef = ref(storage, fileName);
    const metadata = {
      contentType: file.mimetype,
      cacheControl: "public, max-age=31536000",
      customMetadata: {
        uploadedBy: "user",
        uploadedAt: new Date().toISOString(),
      },
    };
    const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
    req.body.uploadedFile = fileName;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const uploadFilesToFirebase = async (
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
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const deleteFileFromFirebaseByImgIds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const str =
    //   '[{"id":"fbec8488-904a-43a6-a1d2-4abf9c704c50","file_name":"1737055108412_images.jpeg"}]';

    // console.log("str", JSON.parse(str));

    let removedImages = req.body.removedImages;
    if (
      typeof removedImages === "string" &&
      removedImages !== "" &&
      removedImages.length > 0
    ) {
      removedImages = JSON.parse(removedImages);
    }

    if (Array.isArray(removedImages) && removedImages.length > 0) {
      console.log(removedImages);
      await Promise.all(
        removedImages.map(async (image: any) => {
          const removedResult = await ProductImg.destroy({
            where: { id: image.id },
          });
          const storageRef = ref(storage, image.file_name);
          await deleteObject(storageRef);
        })
      );
      next();
    } else {
      next();
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
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
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
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

const deleteUserImageFromFirebase = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.id;
    const userImg = await UserImg.findOne({ where: { user_id } });
    if (userImg) {
      const storageRef = ref(storage, userImg.dataValues.file_name);
      await deleteObject(storageRef);
      await UserImg.destroy({ where: { user_id } });
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export {
  uploadFilesToFirebase,
  deleteFileFromFirebase,
  getFileByFileName,
  deleteFileFromFirebaseByImgIds,
  uploadUserImageToFirebase,
  deleteUserImageFromFirebase,
};
