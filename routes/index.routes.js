const express = require("express");
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

// Upload ->
// router.post("/upload", async (req, res) => {

//     console.log("req.files", req.files)
//     const images = req.files?.files ?? null;
//     if (!images) {
//         return res.error("Please Upload File First", 400);
//     }
//     if (Array.isArray(images)) {
//         for (const image of images) {
//             if (image.size > 20 * 1024 * 1024) {
//                 return res.error("Image should not be larger than 20MB", 400);
//             }
//         }
//     }
//     const result = await imageUploader(images);
//     return res.success("Images Uploaded Successfully", result);
// });

router.post("/upload", async (req, res) => {
    const files = req.files?.files;
    console.log("File Of Image ->", files);
    if (!files) {
        return res.error("Please upload file(s) first", 400);
    }

    // Always work with an array, even if 1 file is uploaded
    const images = Array.isArray(files) ? files : [files];

    // Validate size for each image (20MB limit)
    for (const image of images) {
        if (image.size > 20 * 1024 * 1024) {
            return res.error("Each image should not be larger than 20MB", 400);
        }
    }

    const result = await imageUploader(images);
    return res.success("Images uploaded successfully", result);
});

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
