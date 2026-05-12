// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = file.fieldname === 'resume' ? 'uploads/resumes' : 'uploads/avatars';
//     ensureDir(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === 'resume') {
//     const allowed = ['.pdf', '.doc', '.docx'];
//     if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
//       return cb(new Error('Only PDF and Word documents allowed for resume'));
//     }
//   } else {
//     if (!file.mimetype.startsWith('image/')) {
//       return cb(new Error('Only images allowed for avatar'));
//     }
//   }
//   cb(null, true);
// };

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/resumes";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, uploadPath);

  },

  filename: function (req, file, cb) {

    cb(
      null,
      `resume-${Date.now()}${path.extname(
        file.originalname
      )}`
    );

  },

});

export const upload = multer({
  storage,
});