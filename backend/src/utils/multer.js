// import multer from "multer";
// import path from "path";
// import fs from "fs/promises";
// import { fileURLToPath } from "url";
// import compressImageIfNeeded from "../utils/compressImage.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadDir = path.join(__dirname, "../../public/uploads");



// import sharp from "sharp";
// import fs from "fs/promises";
// import path from "path";
// import { statSync } from "fs";

// const compressImageIfNeeded = async (file) => {
//   const filePath = file.path;
//   const ext = path.extname(filePath).toLowerCase();
//   const isImage = [".jpg", ".jpeg", ".png"].includes(ext);
//   const sizeInBytes = statSync(filePath).size;

//   if (!isImage || sizeInBytes <= 1 * 1024 * 1024) {
//     return file; // Skip compression
//   }

//   const compressedPath = path.join(
//     path.dirname(filePath),
//     `compressed-${path.basename(filePath, ext)}.jpg`
//   );

//   await sharp(filePath)
//     .resize(800, 800, {
//       fit: "inside",
//       withoutEnlargement: true,
//     })
//     .toFormat("jpeg", { quality: 80 })
//     .toFile(compressedPath);

//   await fs.unlink(filePath); // remove original

//   return {
//     ...file,
//     path: compressedPath,
//     filename: path.basename(compressedPath),
//   };
// };

// export default compressImageIfNeeded;


// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     await fs.mkdir(uploadDir, { recursive: true }); // ensure dir exists
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const extname = path.extname(file.originalname).toLowerCase();
//     cb(null, `${file.fieldname}-${uniqueSuffix}${extname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf/;
//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimetype = allowedTypes.test(file.mimetype);
//   if (extname && mimetype) cb(null, true);
//   else cb(new Error("Only JPEG, PNG images and PDFs are allowed."));
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter,
// });

// // 🌟 Middleware that works with multer — compression runs after multer saves file
// const uploadWithCompression = (fieldName) => [
//   upload.single(fieldName),
//   async (req, res, next) => {
//     try {
//       if (req.file) {
//         const compressed = await compressImageIfNeeded(req.file);
//         req.file = compressed;
//       }
//       next();
//     } catch (err) {
//       next(err);
//     }
//   },
// ];

// export { uploadWithCompression };


//how to use this middleware in your route

// router.post("/upload", uploadWithCompression("image"), (req, res) => {
//   res.json({
//     message: "Upload successful!",
//     file: req.file,
//   });
// });


// middleware/multerConfig.js
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// 🟢 Step 1: Set up memory storage
const storage = multer.memoryStorage();

// 🟢 Step 2: Multer configuration with extra logs
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log('🟢 File Filter Triggered');
    if (file) {
      console.log('🟢 File detected:', file.originalname); // ✅ Should log filename
    } else {
      console.log('❌ No file detected');
    }

    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// 🟢 Step 3: Middleware logic
upload.singleWithCompression = (fieldName) => {
  return async (req, res, next) => {
    try {
      console.log('🟢 Middleware Triggered: singleWithCompression');
      console.log('🟢 Field Name Expected:', fieldName);      // Expected: 'file'
      console.log('🟢 Incoming file:', req.file);              // <-- This should not be undefined

      if (!req.file) {
        console.log('❌ req.file is undefined!');
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      const originalSize = req.file.size;
      const originalName = req.file.originalname.split('.')[0];
      const outputPath = path.join('uploads', `${originalName}-compressed.jpg`);

      if (originalSize > 102400) {
        await sharp(req.file.buffer)
          .resize(800, 600)
          .jpeg({ quality: 70 })
          .toFile(outputPath);

        req.file.path = outputPath;
        console.log(`🟢 Image compressed and saved at: ${outputPath}`);
      } else {
        fs.writeFileSync(outputPath, req.file.buffer);
        req.file.path = outputPath;
        console.log(`🟢 Image saved without compression at: ${outputPath}`);
      }

      next();
    } catch (error) {
      console.error('❌ Compression error:', error.message);
      res.status(500).json({ error: 'Internal Server Error during image processing.' });
    }
  };
};
