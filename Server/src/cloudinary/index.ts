require('dotenv').config()
import { NextFunction, Request, Response } from "express";
const cloudinary = require('cloudinary').v2; 
// import { v2 as cloudinary } from 'cloudinary';
const streamifier = require('streamifier');

// configuration
cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
})

const cloudinaryUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      // return res.status(400).json({ message: "No file uploaded" });
      // * OR
      // No file uploaded → optional for update, just proceed
      return next(); // If no file, just proceed to the next middleware/controller without uploading
    }

    console.log("Uploading to Cloudinary:", req.file.originalname);

    const uploadStream = await cloudinary.uploader.upload_stream({
        folder: 'Mern2_Ecommerce_Website',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      },
      (error: any , result: any) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Cloudinary upload failed", error });
        }

        // Attach Cloudinary result to req for controller
        (req as any).cloudinaryResult = result;
        next();
      }
    );

    // *Pipe the buffer to Cloudinary
    // result.end(req.file.buffer);
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error("Cloudinary middleware error:", error);
    return res.status(500).json({ message: "Cloudinary upload failed", error });
  }
};

export { cloudinary, cloudinaryUpload };


