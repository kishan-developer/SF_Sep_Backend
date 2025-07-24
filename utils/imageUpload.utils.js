const fs = require("fs");
const path = require("path");

const imageUploader = async (file, imageFileName) => {
    const folder = "uploads/products";
    const uploadPath = path.join(__dirname, "..", folder);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Helper to move a file
    const moveFile = (fileObj) => {
        return new Promise((resolve, reject) => {
            const ext = path.extname(fileObj.name);
            const fileName = `${imageFileName + "-" + Date.now()}-${Math.floor(
                Math.random() * 1e9
            )}${ext}`;
            const filePath = path.join(uploadPath, fileName);

            fileObj.mv(filePath, (err) => {
                if (err) return reject(err);
                resolve(
                    `${process.env.BACKEND_URL}/uploads/products/${fileName}`
                ); // Public URL path
            });
        });
    };

    if (Array.isArray(file)) {
        const uploadedFiles = [];
        for (const item of file) {
            const savedPath = await moveFile(item);
            uploadedFiles.push(savedPath);
        }
        return uploadedFiles;
    }

    const singlePath = await moveFile(file);
    return singlePath;
};

module.exports = imageUploader;
