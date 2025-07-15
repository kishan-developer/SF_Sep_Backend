



// AWS S3 upload file and multiple file 
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
require("dotenv").config();

//  Create S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

//  Manual S3 Upload using fs.readFile
const uploadToS3 = async (filePath, folder, originalName) => {
  const fileContent = fs.readFileSync(filePath);
  const fileExt = path.extname(originalName); // e.g., '.jpg'
  const baseName = path.basename(originalName, fileExt); // filename without extension
  const randomName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${baseName}`;
  const key = `${folder}/${randomName}${fileExt}`;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: mime.lookup(fileExt) || "application/octet-stream", // correct content-type
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

// this code add image in type identifier nad folder name 
// i want profile iamge in seperate nad product images nad order images in defferent differente folders 
const manualUploader = async (type = "", identifier = "", files,  folderName = "uploads") => {
  
  const allowedTypes = ["products", "profile", "orders"];

  if (!allowedTypes.includes(type)) {
    throw new Error("Invalid upload type. Must be 'products', 'profile', or 'orders'.");
  }

  const uploadedUrls = [];
  const filesArray = Array.isArray(files) ? files : [files];

  // Construct S3 folder path: e.g., uploads/products/product_123
  let folderPath = `${folderName}/${type}`;
  if (identifier) {
    folderPath += `/${type}_${identifier}`;
  }

  for (const file of filesArray) {
    if (!file?.tempFilePath || !file?.name) continue;

    const url = await uploadToS3(file.tempFilePath, folderPath, file.name);
    uploadedUrls.push(url);
  }

  return uploadedUrls;
};





// 3️ Streaming upload using multer-s3
const streamUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = Date.now() + "-" + file.originalname;
      cb(null, `uploads/${fileName}`);
    },
  }),
});


// const streamUpload = multer({
//   storage: multerS3({
//     s3,
//     bucket: process.env.AWS_S3_BUCKET_NAME,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: function (req, file, cb) {
//       const fileName = Date.now() + "-" + file.originalname;
//       cb(null, `uploads/${fileName}`);
//     },
//   }),
//   limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
// });


module.exports = {
  manualUploader, // fs.readFile based upload (for tempFilePath like express-fileupload)
  streamUpload   // multer-s3 streaming upload
};
