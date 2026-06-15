// Multer upload configuration for vacation images.
import path from "path";
import fs from "fs";
import multer from "multer";
import { v4 as uuid } from "uuid";

class Upload {

    // Physical folder where uploaded vacation images are saved.
    private readonly uploadFolder = path.join(__dirname, "..", "assets", "images");

    // Expose the configured Multer instance for use in route middlewares.
    public readonly upload: multer.Multer;

    public constructor() {
        this.createUploadFolderIfNotExists();

        const storage = multer.diskStorage({
            destination: (_request, _file, callback) => {
                callback(null, this.uploadFolder);
            },
            filename: (_request, file, callback) => {
                const extension = path.extname(file.originalname);
                const uniqueName = uuid() + extension;
                callback(null, uniqueName);
            }
        });

        this.upload = multer({ storage });
    }

    // Create the upload folder automatically if it does not exist yet.
    private createUploadFolderIfNotExists(): void {
        if (!fs.existsSync(this.uploadFolder)) {
            fs.mkdirSync(this.uploadFolder, { recursive: true });
        }
    }
}

const upload = new Upload().upload;

export default upload;
