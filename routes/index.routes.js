const express = require("express");
const sharp = require("sharp");
const authRoutes = require("../routes/auth.routes");

const adminRoutes = require("../routes/admin/index.routes");
const {
    getAllProducts,
    getProductById,
    getProductByfabric,
} = require("../controller/public/product/product.controller");
const {
    getAllCategories,
    getCategoryById,
} = require("../controller/public/product/category.controller");


const imageUploader = require("../utils/imageUpload.utils");

const userRoutes = require("./user/index.routes");
const paymentRoutes = require("./payment.routes");
const mailSender = require("../utils/mailSender.utils");
const bookVideoCallTemplate = require("../email/template/bookVideoCallTemplate");
const bookVideoCallAdminTemplate = require("../email/template/bookVideoCallAdminTemplate");
const Newsletter = require("../model/Newsletter.model");
const contactEmailTemplate = require("../email/template/contactEmailTemplate");
const {
    getOffer,
    getOfferOfProduct,
} = require("../controller/public/product/offer.controller");


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/payment", paymentRoutes);
// Public routes
// Products
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/:fabric/:id", getProductByfabric);
// Categories
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.get("/offer", getOffer);
router.get("/offer/:productId", getOfferOfProduct);






// max - 8mb 
// const imageUploader = require("../utils/imageUploader"); // adjust path if needed

router.post("/upload", async (req, res) => {
  try {
    const images = req.files?.files ?? null;
    const imageFileName = req.body.name;

    if (!images) {
      return res.status(400).json({ success: false, message: "Please upload file first" });
    }

    const imageList = Array.isArray(images) ? images : [images];
    const slugFileName = imageFileName.trim().replace(/\s+/g, "-");

    const processedImages = [];

    for (const image of imageList) {
      if (!image.size || image.size === 0) {
        return res.status(400).json({ success: false, message: "Uploaded image is empty" });
      }

      // Limit to 8MB
    //   if (image.size > 8 * 1024 * 1024) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Image size should not exceed 8MB",
    //     });
    //   }

      // Compress and resize using Sharp
      const compressedBuffer = await sharp(image.data)
        .resize({ width: 1400 }) // Max width 1200px
        .jpeg({ quality: 90 })   // Compress to 80% quality
        .toBuffer();

      // Upload compressed buffer to Cloudinary
      const uploadResult = await imageUploader({ buffer: compressedBuffer }, slugFileName);
      processedImages.push(uploadResult);
    }

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: processedImages,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});




// router.post("/uploads", async (req, res) => {

//     // console.log("/upload Route")
//   try {
//     const images = req.files?.files ?? null;
//     const imageFileName = req.body.name;

//     if (!images) {
//       return res.status(400).json({ success: false, message: "Please upload file first" });
//     }

//     const imageList = Array.isArray(images) ? images : [images];

//     for (const image of imageList) {
//       if (image.size > 100 * 1024 * 1024) {
//         return res.status(400).json({
//           success: false,
//           message: "Image should not be larger than 100MB",
//         });
//       }
//     }

//     const slugFileName = imageFileName.trim().replace(/\s+/g, "-");

//     const result = await imageUploader(images, slugFileName);

//     return res.status(200).json({
//       success: true,
//       message: "Images uploaded successfully",
//       data: result, // Array of Cloudinary URLs
//     });
//   } catch (err) {
//     // console.error("Upload error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: err.message,
//     });
//   }
// });



// router.post("/upload", async (req, res) => {
//     try {
//         const images = req.files?.files ?? null;
//         const imageFileName = req.body.name;

//         if (!images) {
//             return res.status(400).json({ success: false, message: "Please upload file first" });
//         }

//         const imageList = Array.isArray(images) ? images : [images];
//         const slugFileName = imageFileName.trim().replace(/\s+/g, "-");

//         const processedImages = [];

//         for (const image of imageList) {
//             if (!image.data || image.data.length === 0) {
//                 return res.status(400).json({ success: false, message: "Uploaded image is empty" });
//             }

//             // Process with Sharp (compress + resize)
//             const compressedBuffer = await sharp(image.data)
//                 .resize({ width: 1200 })
//                 .jpeg({ quality: 80 })
//                 .toBuffer();

//             // Pass buffer directly to Cloudinary
//             const uploadResult = await imageUploader({ buffer: compressedBuffer }, slugFileName);
//             processedImages.push(uploadResult);
//         }

//         res.status(200).json({
//             success: true,
//             message: "Images uploaded successfully",
//             data: processedImages,
//         });

//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: err.message,
//         });
//     }
// });


// router.post("/upload", async (req, res) => {
//     try {
//         const images = req.files?.files ?? null;
//         const imageFileName = req.body.name;

//         if (!images) {
//             return res.status(400).json({ success: false, message: "Please upload file first" });
//         }

//         const imageList = Array.isArray(images) ? images : [images];
//         const slugFileName = imageFileName.trim().replace(/\s+/g, "-");

//         const processedImages = [];

//         for (const image of imageList) {
//             if (!image.data || image.data.length === 0) {
//                 return res.status(400).json({ success: false, message: "Uploaded image is empty" });
//             }

//             // Process with Sharp (compress + resize)
//             const compressedBuffer = await sharp(image.data)
//                 .resize({ width: 1200 })
//                 .jpeg({ quality: 80 })
//                 .toBuffer();

//             // Pass buffer directly to Cloudinary
//             const uploadResult = await imageUploader({ buffer: compressedBuffer }, slugFileName);
//             processedImages.push(uploadResult);
//         }

//         res.status(200).json({
//             success: true,
//             message: "Images uploaded successfully",
//             data: processedImages,
//         });

//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: err.message,
//         });
//     }
// });

router.post("/bookVideoCall", async (req, res) => {
    const { email, body } = req.body;

    if (!body) {
        // Use res.status() and res.json() for error responses
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    try {
        const usertemplate = bookVideoCallTemplate(
            body?.fullName,
            body?.date,
            body?.time
        );
        const admintemplate = bookVideoCallAdminTemplate(
            body?.fullName,
            body?.email,
            body?.phone,
            body?.date,
            body?.time,
            "None"
        );

        // Renamed 'res' variable to avoid conflict with the Express 'res' object
        const userMailResponse = await mailSender(
            email,
            "Video Call Book, Confirmation",
            usertemplate
        ); // send to user

        const adminMailResponse = await mailSender(
            "srijanfabs@gmail.com",
            "New Video Call Book",
            admintemplate
        ); // send to Admin

        // Use res.status() and res.json() for success responses
        return res.status(200).json({
            success: true,
            message: "Video Call Booked Successfully",
            data: { userMailResponse, adminMailResponse },
        });
    } catch (error) {
        console.log(error);
        // Use res.status() and res.json() for error responses
        return res.status(500).json({
            success: false,
            message: "Failed to book video call",
        });
    }
});

router.post("/newsletter", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.error("Please enter a valid email address", 400);
    }

    try {
        const exists = await Newsletter.findOne({ email });

        if (exists) {
            return res.error(
                "You are already subscribed to the newsletter.",
                409
            );
        }

        await Newsletter.create({ email });

        return res.success("Successfully subscribed to the newsletter!");
    } catch (err) {
        console.error("Newsletter Error:", err);
        return res.error("Something went wrong. Please try again later.", 500);
    }
});

// POST /api/contact
router.post("/contact", async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const htmlBody = contactEmailTemplate({
            name,
            email,
            phone,
            subject,
            message,
        });

        // Send mail to admin
        await mailSender(
            "srijanfabs@gmail.com",
            `Contact Us: ${subject}`,
            htmlBody
        );

        //  send a confirmation to user
        const userBody = `
      Hi ${name},<br/><br/>
      Thanks for reaching out! We've received your message and will get back to you shortly.<br/><br/>
      Regards,<br/>Srijan Fabs Team
    `;
        await mailSender(email, "We received your message!", userBody);

        return res.json({
            success: true,
            message: "Message sent successfully.",
        });
    } catch (err) {
        console.error("Contact POST error:", err);
        return res.status(500).json({ error: "Failed to send message." });
    }
});

module.exports = router;
