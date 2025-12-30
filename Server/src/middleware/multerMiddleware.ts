// *Useful in all project
import { Request } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
      destination: function (req:Request, file:Express.Multer.File, cb:any) { // cb is a callback function that takes an error and a destination path 
        
        // logic to validate fileType(mimeType)
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if (!allowedFileTypes.includes(file.mimetype)) {
          cb(new Error('File type is not supported.'));
          return ; 
        }

        // logic to validate fileSize
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
          cb(new Error('File size exceeds the limit of 10MB.'));
          return ; 
        }

        cb(null, './src/storage') // the first parameter is an error, the second is the destination path
      },
      filename: function (req:Request, file:Express.Multer.File, cb:any) { // cb is a callback function that takes an error and a filename 
        cb(null, file.originalname)
        // or
        // cb(null, file.fieldname + '-' + file.originalname)
        // or
        // cb(null, Date.now() + '-' + file.originalname) // the first parameter is an error, the second is the filename
        // or
        // cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname) // the first parameter is an error, the second is the filename
        // or
        // cb(null, req.userId + '-' + file.originalname)
      }
    })

    const upload = multer({ storage });

export { upload };

