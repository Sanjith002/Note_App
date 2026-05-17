import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`)
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname= filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if(extname && mimetype){
            return cb(null, true)
        }
        cb(new Error("only images (JPEG, JPG, PNG)are accepted"))
    },
    limits: { fileSize: 5 * 1024 * 1024}
})

export default upload;