import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${ext}`);
  },
});

// Filter allowed file types
const fileFilter = (req, file, cb) => {
  const allowed = [".csv", ".xlsx", ".xls"];

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowed.includes(ext)) {
    return cb(new Error("Only CSV and Excel files are allowed"), false);
  }

  cb(null, true);
};

// 20MB max file
export default multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
});
