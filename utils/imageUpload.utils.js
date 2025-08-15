


const { cloudinary }  = require("../config/cloudinary.js");

const imageUploader = async (file, imageFileName) => {
  const uploadBufferToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          public_id: `${imageFileName}-${Date.now()}`,
          resource_type: "image",
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      );
      stream.end(buffer);
    });
  };

  const uploadFromTempFile = (fileObj) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileObj.tempFilePath,
        {
          folder: "products",
          public_id: `${imageFileName}-${Date.now()}`,
          resource_type: "image",
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      );
    });
  };

  // If file is an array (multiple uploads)
  if (Array.isArray(file)) {
    const uploaded = [];
    for (const f of file) {
      if (f.buffer) {
        uploaded.push(await uploadBufferToCloudinary(f.buffer));
      } else if (f.tempFilePath) {
        uploaded.push(await uploadFromTempFile(f));
      }
    }
    return uploaded;
  }

  // Single file
  if (file.buffer) {
    return await uploadBufferToCloudinary(file.buffer);
  } else if (file.tempFilePath) {
    return await uploadFromTempFile(file);
  }

  throw new Error("Unsupported file format: no buffer or tempFilePath found.");
};

module.exports = imageUploader;



// const { cloudinary }  = require("../config/cloudinary.js");

// const imageUploader = async (file, imageFileName) => {
//   const uploadBufferToCloudinary = (buffer) => {
//     return new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder: "products",
//           public_id: `${imageFileName}-${Date.now()}`,
//           resource_type: "image",
//         },
//         (err, result) => {
//           if (err) return reject(err);
//           resolve(result.secure_url);
//         }
//       );
//       stream.end(buffer);
//     });
//   };

//   const uploadFromTempFile = (fileObj) => {
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload(
//         fileObj.tempFilePath,
//         {
//           folder: "products",
//           public_id: `${imageFileName}-${Date.now()}`,
//           resource_type: "image",
//         },
//         (err, result) => {
//           if (err) return reject(err);
//           resolve(result.secure_url);
//         }
//       );
//     });
//   };

//   // If file is an array (multiple uploads)
//   if (Array.isArray(file)) {
//     const uploaded = [];
//     for (const f of file) {
//       if (f.buffer) {
//         uploaded.push(await uploadBufferToCloudinary(f.buffer));
//       } else if (f.tempFilePath) {
//         uploaded.push(await uploadFromTempFile(f));
//       }
//     }
//     return uploaded;
//   }

//   // Single file
//   if (file.buffer) {
//     return await uploadBufferToCloudinary(file.buffer);
//   } else if (file.tempFilePath) {
//     return await uploadFromTempFile(file);
//   }

//   throw new Error("Unsupported file format: no buffer or tempFilePath found.");
// };

// module.exports = imageUploader;




// const { cloudinary }  = require("../config/cloudinary.js");

// const imageUploader = async (file, imageFileName) => {
//   const uploadBufferToCloudinary = (buffer) => {
//     return new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder: "products",
//           public_id: `${imageFileName}-${Date.now()}`,
//           resource_type: "image",
//         },
//         (err, result) => {
//           if (err) return reject(err);
//           resolve(result.secure_url);
//         }
//       );
//       stream.end(buffer);
//     });
//   };

//   const uploadFromTempFile = (fileObj) => {
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload(
//         fileObj.tempFilePath,
//         {
//           folder: "products",
//           public_id: `${imageFileName}-${Date.now()}`,
//           resource_type: "image",
//         },
//         (err, result) => {
//           if (err) return reject(err);
//           resolve(result.secure_url);
//         }
//       );
//     });
//   };

//   // If file is an array (multiple uploads)
//   if (Array.isArray(file)) {
//     const uploaded = [];
//     for (const f of file) {
//       if (f.buffer) {
//         uploaded.push(await uploadBufferToCloudinary(f.buffer));
//       } else if (f.tempFilePath) {
//         uploaded.push(await uploadFromTempFile(f));
//       }
//     }
//     return uploaded;
//   }

//   // Single file
//   if (file.buffer) {
//     return await uploadBufferToCloudinary(file.buffer);
//   } else if (file.tempFilePath) {
//     return await uploadFromTempFile(file);
//   }

//   throw new Error("Unsupported file format: no buffer or tempFilePath found.");
// };

// module.exports = imageUploader;
















// const fs = require("fs");
// const path = require("path");

// const imageUploader = async (file, imageFileName) => {
//     const folder = "uploads/products";
//     const uploadPath = path.join(__dirname, "..", folder);

//     if (!fs.existsSync(uploadPath)) {
//         fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     // Helper to move a file
//     const moveFile = (fileObj) => {
//         return new Promise((resolve, reject) => {
//             const ext = path.extname(fileObj.name);
//             const fileName = `${imageFileName + "-" + Date.now()}-${Math.floor(
//                 Math.random() * 1e9
//             )}${ext}`;
//             const filePath = path.join(uploadPath, fileName);

//             fileObj.mv(filePath, (err) => {
//                 if (err) return reject(err);
//                 resolve(
//                     `${process.env.BACKEND_URL}/uploads/products/${fileName}`
//                 ); // Public URL path
//             });
//         });
//     };

//     if (Array.isArray(file)) {
//         const uploadedFiles = [];
//         for (const item of file) {
//             const savedPath = await moveFile(item);
//             uploadedFiles.push(savedPath);
//         }
//         return uploadedFiles;
//     }

//     const singlePath = await moveFile(file);
//     return singlePath;
// };

// module.exports = imageUploader;





// ------------------------------------------------
// const fs = require("fs");
// const path = require("path");

// const imageUploader = async (file, imageFileName, productName) => {
//     const folder = `uploads/images/products/${productName}`;
//     const uploadPath = path.join(__dirname, "..", folder);

//     if (!fs.existsSync(uploadPath)) {
//         fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     const moveFile = (fileObj) => {
//         return new Promise((resolve, reject) => {
//             const ext = path.extname(fileObj.name);
//             const fileName = `${imageFileName}-${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
//             const filePath = path.join(uploadPath, fileName);

//             fileObj.mv(filePath, (err) => {
//                 if (err) return reject(err);
//                 resolve(`${process.env.BACKEND_URL}/images/products/${productName}/${fileName}`);
//             });
//         });
//     };

//     if (Array.isArray(file)) {
//         const uploaded = [];
//         for (const f of file) {
//             uploaded.push(await moveFile(f));
//         }
//         return uploaded;
//     }

//     return await moveFile(file);
// };

// module.exports = imageUploader;




/// store image in VPS ROOT/Uploads
// const fs = require("fs");
// const path = require("path");

// const imageUploader = async (file, imageFileName) => {
//     const baseUploadPath = `/root/uploads/image/products`;
    
//     if (!fs.existsSync(baseUploadPath)) {
//         fs.mkdirSync(baseUploadPath, { recursive: true });
//     }

//     const moveFile = (fileObj) => {
//         return new Promise((resolve, reject) => {
//             const ext = path.extname(fileObj.name);
//             const fileName = `${imageFileName}-${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
//             const filePath = path.join(baseUploadPath, fileName);

//             fileObj.mv(filePath, (err) => {
//                 if (err) return reject(err);
//                 resolve(`${process.env.BACKEND_URL}/images/products/${fileName}`);
//             });
//         });
//     };

//     if (Array.isArray(file)) {
//         const uploaded = [];
//         for (const f of file) {
//             uploaded.push(await moveFile(f));
//         }
//         return uploaded;
//     }

//     return await moveFile(file);
// };

// module.exports = imageUploader;

