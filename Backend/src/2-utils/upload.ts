// Multer upload configuration for vacation images.
import path from "path";
import fs from "fs";
import multer from "multer";

const uploadFolder = path.join(__dirname, "../../assets/images");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_request, _file, callback) => {
        callback(null, uploadFolder);
    },
    filename: (_request, file, callback) => {
        const extension = path.extname(file.originalname);
        const uniqueName = Date.now() + extension;
        callback(null, uniqueName);
    }
});

const upload = multer({ storage });

export default upload;