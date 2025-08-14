// config/cloudinary.js
require("dotenv").config();
const cloudinary = require("cloudinary").v2;


// console.log("process.env.CLOUDINARY_CLOUD_NAME", process.env.CLOUDINARY_API_KEY)

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // lowercase
      api_key: process.env.CLOUDINARY_API_KEY,       // lowercase
      api_secret: process.env.CLOUDINARY_API_SECRET, // lowercase
    });
    // console.log(" Cloudinary connected");
  } catch (error) {
    console.log("Error While Connecting To The Cloudinary Server");
  }
};

module.exports = { connectCloudinary, cloudinary };
