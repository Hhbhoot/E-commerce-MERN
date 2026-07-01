import multer from 'multer';
import fs from 'fs';
let UPLOAD_DIR = './uploads';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdir(
    UPLOAD_DIR,
    {
      recursive: true,
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    },
  );
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}_${file.originalname.replaceAll(' ', '_')}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fieldSize: 5 * 1024 * 1024,
  },
});

export default upload;
