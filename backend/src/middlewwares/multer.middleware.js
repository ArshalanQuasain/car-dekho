import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp") 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Configure multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB size limit
});

export { upload };
