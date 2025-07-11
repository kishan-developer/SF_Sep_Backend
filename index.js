const express = require("express");
const cookieParser = require("cookie-parser");
const fileUplaod = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const ratelimit = require("./middleware/rateLimit.middleware");
const notFound = require("./middleware/notFound.middleware");
const sendCustomResponse = require("./middleware/customResponse.middleware");
const connectDB = require("./config/connectDb");
require("dotenv").config();
const {
    globalErrorHandler,
} = require("./middleware/globalErrorHandler.middleware");
const connectCloudinary = require("./config/cloudinary");
const imageUploader = require("./utils/imageUpload.utils");
const router = require("./routes/index.routes");
// Connect Database
connectDB(); // connect Database
connectCloudinary(); // connect cloudinary

const app = express();
// use compresstion
app.use(compression());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://192.168.1.26:5555",
    "https://shreejan-fab-frontend.vercel.app",
];

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
// Limit repeated requests (rate limiting)
// app.use(ratelimit);
// Secure HTTP headers to protect your app
app.use(helmet());
// Sanitize input to prevent NoSQL injection attacks

// Handle file uploads, with temporary storage for large files
app.use(
    fileUplaod({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

app.use(sendCustomResponse);
// Routes For Login, Register, Send-Otp, Forgott-Password, Reset Password

// Stating from this route localhost:8000/api/v1/auth/register
app.use("/api/v1", router);

//
app.get("/", (req, res) => {
    return res.success("Welcome! Test route is working");
});

app.use(notFound);
app.use(globalErrorHandler);
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
