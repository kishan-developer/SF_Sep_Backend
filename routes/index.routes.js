const express = require("express");
const sharp = require("sharp");

const authRoutes = require("../routes/auth.routes");
const adminRoutes = require("../routes/admin/index.routes");
const userRoutes = require("./user/index.routes");
const paymentRoutes = require("./payment.routes");
const { blogRouter } = require("./blog.routes"); // fixed import
const  { commentRouter } = require("./comment.routes"); // fixed import

const {
  getAllProducts,
  getProductById,
  getProductByfabric,
} = require("../controller/public/product/product.controller");

const {
  getAllCategories,
  getCategoryById,
} = require("../controller/public/product/category.controller");

const {
  getOffer,
  getOfferOfProduct,
} = require("../controller/public/product/offer.controller");

const imageUploader = require("../utils/imageUpload.utils");
const mailSender = require("../utils/mailSender.utils");

const bookVideoCallTemplate = require("../email/template/bookVideoCallTemplate");
const bookVideoCallAdminTemplate = require("../email/template/bookVideoCallAdminTemplate");
const contactEmailTemplate = require("../email/template/contactEmailTemplate");
const Newsletter = require("../model/Newsletter.model");

const router = express.Router();

// Auth and admin routes
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/payment", paymentRoutes);

// Blog & Comment APIs
router.use("/blogs", blogRouter);
router.use("/comments", commentRouter);

// Public routes
// Products
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/:fabric/:id", getProductByfabric);

// Categories
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);

// Offers
router.get("/offer", getOffer);
router.get("/offer/:productId", getOfferOfProduct);

// Image upload route
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

      // Compress and resize using Sharp
      const compressedBuffer = await sharp(image.data)
        .resize({ width: 1400 })
        .jpeg({ quality: 90 })
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

// Book Video Call
router.post("/bookVideoCall", async (req, res) => {
  const { email, body } = req.body;

  if (!body) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const userTemplate = bookVideoCallTemplate(body.fullName, body.date, body.time);
    const adminTemplate = bookVideoCallAdminTemplate(
      body.fullName,
      body.email,
      body.phone,
      body.date,
      body.time,
      "None"
    );

    const userMailResponse = await mailSender(email, "Video Call Book, Confirmation", userTemplate);
    const adminMailResponse = await mailSender("srijanfabs@gmail.com", "New Video Call Book", adminTemplate);

    res.status(200).json({
      success: true,
      message: "Video Call Booked Successfully",
      data: { userMailResponse, adminMailResponse },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to book video call" });
  }
});

// Newsletter subscription
router.post("/newsletter", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address" });
  }

  try {
    const exists = await Newsletter.findOne({ email });

    if (exists) {
      return res.status(409).json({ success: false, message: "You are already subscribed to the newsletter." });
    }

    await Newsletter.create({ email });

    res.status(200).json({ success: true, message: "Successfully subscribed to the newsletter!" });
  } catch (err) {
    console.error("Newsletter Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
  }
});

// Contact form
router.post("/contact", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const htmlBody = contactEmailTemplate({ name, email, phone, subject, message });
    await mailSender("srijanfabs@gmail.com", `Contact Us: ${subject}`, htmlBody);

    const userBody = `
      Hi ${name},<br/><br/>
      Thanks for reaching out! We've received your message and will get back to you shortly.<br/><br/>
      Regards,<br/>Srijan Fabs Team
    `;
    await mailSender(email, "We received your message!", userBody);

    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("Contact POST error:", err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

module.exports = router;
